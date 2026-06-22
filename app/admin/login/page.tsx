import { Suspense } from "react";
import AdminLoginPage from "./AdminLoginPage";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <AdminLoginPage />
    </Suspense>
  );
}
