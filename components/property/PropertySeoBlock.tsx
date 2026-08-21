import Link from "next/link";
import {
  getPropertySeo,
  propertyDetailPath,
  type PropertySeoEntry,
} from "@/lib/propertySeo";
import BookSiteVisitButton from "@/components/BookSiteVisitButton";

function RelatedProperties({
  ids,
  currentId,
}: {
  ids: number[];
  currentId: number;
}) {
  const related = ids
    .filter((id) => id !== currentId)
    .map((id) => getPropertySeo(id))
    .filter((p): p is PropertySeoEntry => Boolean(p));

  if (related.length === 0) return null;

  return (
    <section className="mt-10 border-t border-neutral-200 pt-10">
      <h2 className="font-montserrat text-xl font-bold text-dark-900 md:text-2xl">
        Similar land for sale in Kilifi County
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((item) => (
          <li key={item.id}>
            <Link
              href={propertyDetailPath(item.id)}
              className="block rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 font-montserrat text-sm transition hover:border-primary-400 hover:bg-white"
            >
              <span className="font-semibold text-dark-900">{item.title}</span>
              <span className="mt-1 block text-dark-600">{item.location}</span>
              <span className="mt-1 block font-medium text-primary-700">
                {item.price}
                {item.soldOut ? " · Sold out" : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function PropertySeoBlock({ propertyId }: { propertyId: number }) {
  const property = getPropertySeo(propertyId);

  if (!property || property.schemaOnly) return null;
  if (!property.seoSections?.length && !property.faq?.length) {
    return null;
  }

  return (
    <section
      className="border-t border-neutral-200 bg-neutral-50 py-12 font-montserrat"
      aria-label="Property location and investment information"
    >
      <div className="container mx-auto max-w-4xl px-4">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-dark-600">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="hover:text-primary-700">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/for-sale" className="hover:text-primary-700">
                Land for sale in Kilifi
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-dark-900">{property.title}</li>
          </ol>
        </nav>

        {property.seoSections?.map((section) => (
          <article key={section.heading} className="mb-8">
            <h2 className="text-xl font-bold text-dark-900 md:text-2xl">
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="mt-3 leading-relaxed text-dark-700"
              >
                {paragraph}
              </p>
            ))}
          </article>
        ))}

        {property.faq && property.faq.length > 0 && (
          <section aria-labelledby="property-faq-heading">
            <h2
              id="property-faq-heading"
              className="text-xl font-bold text-dark-900 md:text-2xl"
            >
              Frequently asked questions — {property.title}
            </h2>
            <dl className="mt-6 space-y-6">
              {property.faq.map((item) => (
                <div
                  key={item.question}
                  className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
                >
                  <dt className="font-semibold text-dark-900">{item.question}</dt>
                  <dd className="mt-2 leading-relaxed text-dark-700">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {property.relatedPropertyIds && (
          <RelatedProperties
            ids={property.relatedPropertyIds}
            currentId={propertyId}
          />
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <BookSiteVisitButton
            propertyId={propertyId}
            propertyTitle={property.title}
            source="property_seo"
            className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Book a site visit
          </BookSiteVisitButton>
          <Link
            href="/for-sale"
            className="rounded-lg border border-primary-600 px-5 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50"
          >
            View all Kilifi properties
          </Link>
          <Link
            href="/iapl-insider/blogs"
            className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-dark-700 hover:bg-white"
          >
            Land investment guides
          </Link>
        </div>
      </div>
    </section>
  );
}
