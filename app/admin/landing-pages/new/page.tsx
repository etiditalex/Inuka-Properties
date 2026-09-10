import LandingPageFormPage from "../LandingPageForm";

export default function NewLandingPage({
  searchParams,
}: {
  searchParams: { from?: string };
}) {
  const from = searchParams.from ? parseInt(searchParams.from, 10) : undefined;
  return (
    <LandingPageFormPage
      duplicateFromId={from && Number.isFinite(from) ? from : undefined}
    />
  );
}
