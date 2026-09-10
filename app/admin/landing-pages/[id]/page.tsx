"use client";

import LandingPageFormPage from "../LandingPageForm";

export default function EditLandingPage({ params }: { params: { id: string } }) {
  return <LandingPageFormPage pageId={parseInt(params.id, 10)} />;
}
