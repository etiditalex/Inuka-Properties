import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  CODE_TTL_MS,
  MAX_VERIFY_ATTEMPTS,
  decryptSession,
  generateLoginCode,
  hashLoginCode,
  sendLoginVerificationEmail,
} from "@/lib/admin/login-verification";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const verificationId = String(body.verificationId || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const code = String(body.code || "").trim();

    if (!verificationId || !email || !code) {
      return NextResponse.json(
        { error: "Verification ID, email, and code are required" },
        { status: 400 }
      );
    }

    const serviceClient = createServiceClient();
    if (!serviceClient) {
      return NextResponse.json(
        { error: "Authentication service is not configured" },
        { status: 503 }
      );
    }

    const { data: row, error: fetchError } = await serviceClient
      .from("admin_login_codes")
      .select("*")
      .eq("id", verificationId)
      .eq("email", email)
      .maybeSingle();

    if (fetchError || !row) {
      return NextResponse.json({ error: "Invalid or expired verification" }, { status: 401 });
    }

    if (new Date(row.expires_at).getTime() < Date.now()) {
      await serviceClient.from("admin_login_codes").delete().eq("id", verificationId);
      return NextResponse.json({ error: "Verification code has expired" }, { status: 401 });
    }

    if (row.attempts >= MAX_VERIFY_ATTEMPTS) {
      await serviceClient.from("admin_login_codes").delete().eq("id", verificationId);
      return NextResponse.json(
        { error: "Too many failed attempts. Please sign in again." },
        { status: 429 }
      );
    }

    const expectedHash = hashLoginCode(code, verificationId);
    if (expectedHash !== row.code_hash) {
      await serviceClient
        .from("admin_login_codes")
        .update({ attempts: row.attempts + 1 })
        .eq("id", verificationId);
      return NextResponse.json({ error: "Invalid verification code" }, { status: 401 });
    }

    const session = decryptSession(row.session_encrypted);
    const response = NextResponse.json({ success: true });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error: sessionError } = await supabase.auth.setSession(session);
    if (sessionError) {
      return NextResponse.json({ error: "Could not complete sign-in" }, { status: 500 });
    }

    await serviceClient.from("admin_login_codes").delete().eq("id", verificationId);

    return response;
  } catch (err) {
    console.error("[admin login verify]", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const verificationId = String(body.verificationId || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    if (!verificationId || !email) {
      return NextResponse.json({ error: "Verification ID and email are required" }, { status: 400 });
    }

    const serviceClient = createServiceClient();
    if (!serviceClient) {
      return NextResponse.json(
        { error: "Authentication service is not configured" },
        { status: 503 }
      );
    }

    const { data: row, error: fetchError } = await serviceClient
      .from("admin_login_codes")
      .select("*")
      .eq("id", verificationId)
      .eq("email", email)
      .maybeSingle();

    if (fetchError || !row) {
      return NextResponse.json({ error: "Invalid or expired verification" }, { status: 401 });
    }

    if (new Date(row.expires_at).getTime() < Date.now()) {
      await serviceClient.from("admin_login_codes").delete().eq("id", verificationId);
      return NextResponse.json({ error: "Verification has expired. Please sign in again." }, { status: 401 });
    }

    const code = generateLoginCode();
    const codeHash = hashLoginCode(code, verificationId);

    const { error: updateError } = await serviceClient
      .from("admin_login_codes")
      .update({
        code_hash: codeHash,
        attempts: 0,
        expires_at: new Date(Date.now() + CODE_TTL_MS).toISOString(),
      })
      .eq("id", verificationId);

    if (updateError) {
      return NextResponse.json({ error: "Could not resend code" }, { status: 500 });
    }

    const sent = await sendLoginVerificationEmail(email, code);
    if (!sent) {
      return NextResponse.json({ error: "Could not send verification email" }, { status: 500 });
    }

    return NextResponse.json({ message: "A new verification code has been sent." });
  } catch (err) {
    console.error("[admin login resend]", err);
    return NextResponse.json({ error: "Could not resend code" }, { status: 500 });
  }
}
