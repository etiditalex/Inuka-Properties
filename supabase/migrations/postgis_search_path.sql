-- Prepare plot functions for PostGIS living in the extensions schema.
-- Safe to run before or after Supabase Support moves the extension.
-- This does not clear the Security Advisor warning on its own: spatial_ref_sys
-- is owned by supabase_admin, so this role cannot enable RLS or revoke access.

do $$
begin
  if to_regprocedure('public.save_plot_map(jsonb)') is not null then
    execute 'alter function public.save_plot_map(jsonb) set search_path = public, extensions';
  end if;

  if to_regprocedure('public.reserve_plot_parcel(uuid, text, uuid)') is not null then
    execute 'alter function public.reserve_plot_parcel(uuid, text, uuid) set search_path = public, extensions';
  end if;
end $$;
