import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { authConfigError } from "@/lib/admin/auth-config";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";
import {
  CODE_TTL_MS,
  encryptSession,
  generateLoginCode,
  hashLoginCode,
  sendLoginVerificationEmail,
} from "@/lib/admin/login-verification";

export const dynamic = "force-dynamic";

function getAuthClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const authClient = getAuthClient();
    const serviceClient = createServiceClient();

    if (!authClient || !serviceClient) {
      return NextResponse.json({ error: authConfigError() }, { status: 503 });
    }

    const { data, error } = await authClient.auth.signInWithPassword({ email, password });

    if (error || !data.session || !data.user?.email) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const verificationId = crypto.randomUUID();
    const code = generateLoginCode();
    const codeHash = hashLoginCode(code, verificationId);
    const sessionEncrypted = encryptSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });

    await serviceClient.from("admin_login_codes").delete().eq("user_id", data.user.id);

    const { error: insertError } = await serviceClient.from("admin_login_codes").insert({
      id: verificationId,
      user_id: data.user.id,
      email: data.user.email,
      code_hash: codeHash,
      session_encrypted: sessionEncrypted,
      expires_at: new Date(Date.now() + CODE_TTL_MS).toISOString(),
    });

    if (insertError) {
      console.error("[admin login] insert:", insertError.message, insertError.code);
      const hint =
        insertError.code === "42P01" || insertError.message?.includes("admin_login_codes")
          ? " Run supabase/migrations/admin_login_codes.sql in the Supabase SQL Editor."
          : "";
      return NextResponse.json(
        {
          error:
            process.env.NODE_ENV === "development"
              ? `Could not start verification: ${insertError.message}.${hint}`
              : `Could not start verification.${hint}`,
        },
        { status: 500 }
      );
    }

    const sent = await sendLoginVerificationEmail(data.user.email, code);
    if (!sent) {
      await serviceClient.from("admin_login_codes").delete().eq("id", verificationId);
      return NextResponse.json(
        { error: "Could not send verification email. Check RESEND_API_KEY." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      verificationId,
      email: data.user.email,
      message: "Verification code sent to your email.",
    });
  } catch (err) {
    console.error("[admin login]", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
