export function getMissingAuthEnvVars(): string[] {
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  return missing;
}

export function authConfigError(): string {
  const missing = getMissingAuthEnvVars();
  if (missing.length === 0) return "";
  return `Authentication service is not configured. Add in Vercel → Settings → Environment Variables, then redeploy: ${missing.join(", ")}`;
}
