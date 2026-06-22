"use client";

import PropertyFormPage from "../PropertyForm";

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  return <PropertyFormPage propertyId={parseInt(params.id, 10)} />;
}
