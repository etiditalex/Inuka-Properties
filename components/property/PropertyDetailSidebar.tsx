"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { STATIC_PROPERTY_CATALOG, type CatalogProperty } from "@/lib/properties/catalog";
import { getAvailableProperties } from "@/lib/properties/sortProperties";
import { propertyDetailPath } from "@/lib/propertySeo";

export default function PropertyDetailSidebar({ currentId }: { currentId: number }) {
  const router = useRouter();
  const [properties, setProperties] = useState<CatalogProperty[]>(() =>
    getAvailableProperties(STATIC_PROPERTY_CATALOG)
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/content/properties", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { properties?: CatalogProperty[] } | null) => {
        if (data?.properties?.length) {
          setProperties(getAvailableProperties(data.properties));
        }
      })
      .catch(() => {});
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return properties;
    return properties.filter(
      (property) =>
        property.title.toLowerCase().includes(needle) ||
        property.location.toLowerCase().includes(needle)
    );
  }, [properties, query]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const needle = query.trim();
    if (!needle) return;
    router.push(`/for-sale?q=${encodeURIComponent(needle)}`);
  };

  return (
    <aside className="w-full shrink-0 min-[801px]:w-[28%]">
      <form role="search" aria-label="Search properties" onSubmit={submitSearch} className="bg-primary-50 p-2.5">
        <label htmlFor="property-detail-search" className="sr-only">
          Search for:
        </label>
        <div className="flex h-[50px]">
          <input
            id="property-detail-search"
            name="q"
            type="search"
            required
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search..."
            className="min-w-0 flex-1 border border-dark-200 bg-white px-3 font-montserrat text-base text-black outline-none focus:border-primary-700"
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex w-12 shrink-0 items-center justify-center bg-primary-700 text-white transition hover:bg-primary-800"
          >
            <Search size={18} aria-hidden="true" />
          </button>
        </div>
      </form>

      <div className="mt-4 bg-primary-50 p-2.5">
        <h2 className="px-2 pb-2 font-montserrat text-base font-semibold text-neutral-800">Properties on Sale</h2>
        <nav aria-label="Properties on Sale">
          {visible.length === 0 ? (
            <p className="px-3 py-2 font-montserrat text-[15px] text-black">No matching properties.</p>
          ) : (
            <ul>
              {visible.map((property) => {
                const current = property.id === currentId;
                return (
                  <li key={property.id}>
                    <Link
                      href={propertyDetailPath(property.id)}
                      aria-current={current ? "page" : undefined}
                      className={`block py-2 pl-5 pr-2.5 font-montserrat text-[15px] font-medium leading-6 text-primary-800 hover:underline ${
                        current ? "font-semibold" : ""
                      }`}
                    >
                      {property.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>
      </div>
    </aside>
  );
}
