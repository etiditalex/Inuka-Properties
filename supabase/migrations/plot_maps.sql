-- Plot maps: one subdivision per land listing.
-- Run this in the Supabase SQL editor.

create extension if not exists postgis;

create table if not exists plot_maps (
  id uuid primary key default gen_random_uuid(),
  property_id integer not null unique references properties(id) on delete cascade,
  slug text not null unique,
  project_name text not null,
  location text not null default '',
  survey_ref text,
  alignment_status text not null default 'unverified'
    check (alignment_status in ('unverified', 'draft', 'verified')),
  crs text not null default 'local-metres'
    check (crs in ('local-metres', 'EPSG:4326')),
  published boolean not null default false,
  document jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists plot_parcels (
  id uuid primary key default gen_random_uuid(),
  plot_map_id uuid not null references plot_maps(id) on delete cascade,
  plot_number text not null,
  status text not null default 'available'
    check (status in ('available', 'reserved', 'sold', 'on_hold')),
  area_m2 numeric,
  frontage_m numeric,
  depth_m numeric,
  price_kes numeric,
  deposit_kes numeric,
  payment_period text,
  geometry jsonb not null,
  plan_geometry jsonb,
  geom geometry(Polygon, 4326),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (plot_map_id, plot_number)
);

create index if not exists plot_parcels_geom_idx on plot_parcels using gist (geom);
create index if not exists plot_parcels_map_idx on plot_parcels (plot_map_id);

create table if not exists plot_roads (
  id uuid primary key default gen_random_uuid(),
  plot_map_id uuid not null references plot_maps(id) on delete cascade,
  name text not null,
  width_m numeric,
  width_source text,
  geometry jsonb not null,
  geom geometry(Polygon, 4326)
);

create index if not exists plot_roads_geom_idx on plot_roads using gist (geom);

create table if not exists plot_control_points (
  id uuid primary key default gen_random_uuid(),
  plot_map_id uuid not null references plot_maps(id) on delete cascade,
  point_key text not null,
  label text not null,
  plan_x double precision not null,
  plan_y double precision not null,
  ground_lng double precision,
  ground_lat double precision,
  unique (plot_map_id, point_key)
);

create table if not exists plot_status_history (
  id uuid primary key default gen_random_uuid(),
  plot_map_id uuid not null references plot_maps(id) on delete cascade,
  plot_number text not null,
  from_status text,
  to_status text not null,
  actor_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists plot_activity_log (
  id uuid primary key default gen_random_uuid(),
  plot_map_id uuid not null references plot_maps(id) on delete cascade,
  actor_id uuid,
  action text not null,
  detail jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table plot_maps enable row level security;
alter table plot_parcels enable row level security;
alter table plot_roads enable row level security;
alter table plot_control_points enable row level security;
alter table plot_status_history enable row level security;
alter table plot_activity_log enable row level security;

drop policy if exists plot_maps_public_read on plot_maps;
create policy plot_maps_public_read on plot_maps
  for select using (published);

drop policy if exists plot_parcels_public_read on plot_parcels;
create policy plot_parcels_public_read on plot_parcels
  for select using (
    exists (select 1 from plot_maps where plot_maps.id = plot_parcels.plot_map_id and plot_maps.published)
  );

drop policy if exists plot_roads_public_read on plot_roads;
create policy plot_roads_public_read on plot_roads
  for select using (
    exists (select 1 from plot_maps where plot_maps.id = plot_roads.plot_map_id and plot_maps.published)
  );

create or replace function save_plot_map(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  mid uuid;
  actor uuid;
  plot jsonb;
  road jsonb;
  point jsonb;
  previous text;
  parcel_geom geometry(Polygon, 4326);
  closed jsonb;
begin
  if payload->>'slug' is null or payload->>'propertyId' is null then
    raise exception 'slug and propertyId are required';
  end if;
  if payload->>'actorId' ~* '^[0-9a-f-]{36}$' then
    actor := (payload->>'actorId')::uuid;
  end if;

  insert into plot_maps (
    property_id, slug, project_name, location, survey_ref,
    alignment_status, crs, published, document
  ) values (
    (payload->>'propertyId')::int,
    payload->>'slug',
    coalesce(payload->>'projectName', ''),
    coalesce(payload->>'location', ''),
    payload->>'surveyRef',
    coalesce(payload->>'alignmentStatus', 'unverified'),
    coalesce(payload->>'crs', 'local-metres'),
    coalesce((payload->>'published')::boolean, false),
    payload - 'actorId'
  )
  on conflict (slug) do update set
    property_id = excluded.property_id,
    project_name = excluded.project_name,
    location = excluded.location,
    survey_ref = excluded.survey_ref,
    alignment_status = excluded.alignment_status,
    crs = excluded.crs,
    published = excluded.published,
    document = excluded.document,
    updated_at = now()
  returning id into mid;

  create temporary table if not exists _plot_status_before (
    plot_number text primary key,
    status text
  ) on commit drop;
  delete from _plot_status_before;
  insert into _plot_status_before (plot_number, status)
  select plot_number, status from plot_parcels where plot_map_id = mid;

  delete from plot_parcels where plot_map_id = mid;
  delete from plot_roads where plot_map_id = mid;
  delete from plot_control_points where plot_map_id = mid;

  for plot in select * from jsonb_array_elements(coalesce(payload->'plots', '[]'::jsonb))
  loop
    closed := plot->'ring';
    if jsonb_array_length(closed) > 0 and closed->0 is distinct from closed->-1 then
      closed := closed || jsonb_build_array(closed->0);
    end if;
    parcel_geom := null;
    if payload->>'crs' = 'EPSG:4326' then
      parcel_geom := st_setsrid(
        st_geomfromgeojson(jsonb_build_object('type', 'Polygon', 'coordinates', jsonb_build_array(closed))::text),
        4326
      );
      if not st_isvalid(parcel_geom) then
        raise exception 'Plot % is not a valid polygon', plot->>'plotNumber';
      end if;
    end if;

    insert into plot_parcels (
      plot_map_id, plot_number, status, area_m2, frontage_m, depth_m,
      price_kes, deposit_kes, payment_period, geometry, plan_geometry, geom
    ) values (
      mid,
      plot->>'plotNumber',
      coalesce(plot->>'status', 'available'),
      (plot->>'areaM2')::numeric,
      (plot->>'frontageM')::numeric,
      (plot->>'depthM')::numeric,
      (plot->>'priceKes')::numeric,
      (plot->>'depositKes')::numeric,
      plot->>'paymentPeriod',
      jsonb_build_object('type', 'Polygon', 'coordinates', jsonb_build_array(plot->'ring')),
      plot->'planRing',
      parcel_geom
    );

    select status into previous from _plot_status_before where plot_number = plot->>'plotNumber';
    if previous is not null and previous is distinct from coalesce(plot->>'status', 'available') then
      insert into plot_status_history (plot_map_id, plot_number, from_status, to_status, actor_id)
      values (mid, plot->>'plotNumber', previous, plot->>'status', actor);
    end if;
  end loop;

  if payload->>'crs' = 'EPSG:4326' then
    if exists (
      select 1
      from plot_parcels a
      join plot_parcels b
        on a.plot_map_id = b.plot_map_id
       and a.plot_number < b.plot_number
      where a.plot_map_id = mid
        and a.geom is not null
        and b.geom is not null
        and st_area(st_intersection(a.geom, b.geom)::geography) > 1
    ) then
      raise exception 'Two plots overlap';
    end if;
  end if;

  for road in select * from jsonb_array_elements(coalesce(payload->'roads', '[]'::jsonb))
  loop
    insert into plot_roads (plot_map_id, name, width_m, width_source, geometry)
    values (
      mid,
      coalesce(road->>'name', 'Road'),
      (road->>'widthM')::numeric,
      road->>'widthSource',
      jsonb_build_object('type', 'Polygon', 'coordinates', jsonb_build_array(road->'ring'))
    );
  end loop;

  for point in select * from jsonb_array_elements(coalesce(payload->'controlPoints', '[]'::jsonb))
  loop
    insert into plot_control_points (plot_map_id, point_key, label, plan_x, plan_y, ground_lng, ground_lat)
    values (
      mid,
      point->>'id',
      point->>'label',
      (point#>>'{plan,0}')::float8,
      (point#>>'{plan,1}')::float8,
      (point#>>'{ground,0}')::float8,
      (point#>>'{ground,1}')::float8
    );
  end loop;

  insert into plot_activity_log (plot_map_id, actor_id, action, detail)
  values (
    mid,
    actor,
    'save',
    jsonb_build_object(
      'alignment', payload->>'alignmentStatus',
      'plots', jsonb_array_length(coalesce(payload->'plots', '[]'::jsonb))
    )
  );

  return payload - 'actorId';
end;
$$;

revoke all on function save_plot_map(jsonb) from public;
grant execute on function save_plot_map(jsonb) to service_role;

create or replace function reserve_plot_parcel(p_map uuid, p_number text, p_actor uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  rec plot_parcels%rowtype;
  current_doc jsonb;
  next_plots jsonb;
begin
  select * into rec
  from plot_parcels
  where plot_map_id = p_map and plot_number = p_number
  for update;
  if not found then
    raise exception 'Plot not found';
  end if;
  if rec.status <> 'available' then
    raise exception 'Plot % is already %', p_number, rec.status;
  end if;
  update plot_parcels
  set status = 'reserved', updated_at = now()
  where id = rec.id;

  select document into current_doc from plot_maps where id = p_map for update;
  select coalesce(jsonb_agg(
    case
      when item.plot->>'plotNumber' = p_number then jsonb_set(item.plot, '{status}', '"reserved"')
      else item.plot
    end
    order by item.ordinality
  ), '[]'::jsonb)
  into next_plots
  from jsonb_array_elements(coalesce(current_doc->'plots', '[]'::jsonb)) with ordinality as item(plot, ordinality);

  update plot_maps
  set document = jsonb_set(current_doc, '{plots}', next_plots),
      updated_at = now()
  where id = p_map;
  insert into plot_status_history (plot_map_id, plot_number, from_status, to_status, actor_id)
  values (p_map, p_number, 'available', 'reserved', p_actor);
  return jsonb_build_object('plotNumber', p_number, 'status', 'reserved');
end;
$$;

revoke all on function reserve_plot_parcel(uuid, text, uuid) from public;
grant execute on function reserve_plot_parcel(uuid, text, uuid) to service_role;
