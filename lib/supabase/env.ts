/**
 * Supabase env helpers — read at runtime via dynamic keys so Vercel/serverless
 * sees values even when NEXT_PUBLIC_* were not present at build time.
 */
function readEnv(names: readonly string[]): string {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return "";
}

export function getSupabaseUrl(): string {
  return readEnv(["SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"]);
}

export function getSupabaseAnonKey(): string {
  return readEnv([
    "SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_KEY",
  ]);
}

export function getSupabaseServiceRoleKey(): string {
  return readEnv([
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_SECRET_KEY",
    "SUPABASE_SERVICE_KEY",
  ]);
}

export function isSupabaseServerConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function isSupabaseAuthConfigured(): boolean {
  return Boolean(
    getSupabaseUrl() && getSupabaseAnonKey() && getSupabaseServiceRoleKey()
  );
}

export function getMissingAuthEnvVars(): string[] {
  const missing: string[] = [];
  if (!getSupabaseUrl()) {
    missing.push("SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)");
  }
  if (!getSupabaseAnonKey()) {
    missing.push("SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)");
  }
  if (!getSupabaseServiceRoleKey()) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }
  return missing;
}

export function authConfigError(): string {
  const missing = getMissingAuthEnvVars();
  if (missing.length === 0) return "";
  return `Authentication service is not configured. Add in Vercel → Settings → Environment Variables (Production), then redeploy without cache: ${missing.join(", ")}`;
}
