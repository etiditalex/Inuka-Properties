"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { adminPath } from "@/lib/admin/path";

const LOGIN_ILLUSTRATION = "/admin/login-illustration-right.png";
const LOGIN_ILLUSTRATION_2X = "/admin/login-illustration-right@2x.png";

type Step = "credentials" | "verify";

function UserAvatarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-8 w-8 text-white"
      aria-hidden
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || adminPath();

  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      if (!data.verificationId) {
        setError("Could not start verification. Check server logs.");
        return;
      }

      setVerificationId(data.verificationId);
      setStep("verify");
      setCode("");
      setMessage(data.message || "Verification code sent to your email.");
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationId, email, code, redirect }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed");
        return;
      }

      if (data.session?.access_token && data.session?.refresh_token) {
        const supabase = createClient();
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        if (sessionError) {
          setError(sessionError.message || "Could not save your session. Try again.");
          return;
        }
      }

      window.location.assign(data.redirect || redirect);
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login/verify", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationId, email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not resend code");
        return;
      }

      setMessage(data.message || "A new verification code has been sent.");
    } catch {
      setError("Could not resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setMessage("");
    if (!email.trim()) {
      setError("Enter your email address above, then click forgot password.");
      return;
    }
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${adminPath("login")}`,
    });
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setMessage("Password reset link sent to your email.");
  };

  const handleBackToLogin = () => {
    setStep("credentials");
    setVerificationId("");
    setCode("");
    setError("");
    setMessage("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans lg:flex-row">
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-[340px]">
          <p className="mb-8 text-center text-2xl font-semibold tracking-tight text-[#3d3d3d] sm:text-3xl">
            Welcome
          </p>

          <div className="mb-6 flex justify-center">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#4a6cf7] shadow-sm">
              <UserAvatarIcon />
            </div>
          </div>

          <h1 className="mb-8 text-center text-xl font-bold text-[#3d3d3d]">
            {step === "credentials" ? "User Log in" : "Verify your email"}
          </h1>

          {step === "credentials" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="User ID *"
                  required
                  autoComplete="email"
                  className="w-full rounded-md border border-[#c8c8c8] bg-white px-4 py-3.5 text-sm text-[#3d3d3d] outline-none transition placeholder:text-[#9ca3af] focus:border-[#4a6cf7] focus:ring-2 focus:ring-[#4a6cf7]/20"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• *"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-md border border-[#c8c8c8] bg-white px-4 py-3.5 text-sm text-[#3d3d3d] outline-none transition placeholder:text-[#3d3d3d] focus:border-[#4a6cf7] focus:ring-2 focus:ring-[#4a6cf7]/20"
                />
              </div>

              {error && <p className="text-center text-xs text-red-600">{error}</p>}
              {message && <p className="text-center text-xs text-[#4a6cf7]">{message}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#4a6cf7] py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#3f5ee0] disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <p className="text-center text-sm text-[#6b7280]">
                Enter the 6-digit code sent to <span className="font-medium text-[#3d3d3d]">{email}</span>
              </p>

              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  required
                  autoComplete="one-time-code"
                  className="w-full rounded-md border border-[#c8c8c8] bg-white px-4 py-3.5 text-center text-lg tracking-[0.4em] text-[#3d3d3d] outline-none transition placeholder:text-[#9ca3af] focus:border-[#4a6cf7] focus:ring-2 focus:ring-[#4a6cf7]/20"
                />
              </div>

              {error && <p className="text-center text-xs text-red-600">{error}</p>}
              {message && <p className="text-center text-xs text-[#4a6cf7]">{message}</p>}

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full rounded-md bg-[#4a6cf7] py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#3f5ee0] disabled:opacity-60"
              >
                {loading ? "Verifying…" : "Verify & Continue"}
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="w-full text-center text-sm text-[#6b9ae8] transition hover:text-[#4a6cf7] disabled:opacity-60"
              >
                Resend code
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full text-center text-sm text-[#9ca3af] transition hover:text-[#4a6cf7]"
              >
                Back to login
              </button>
            </form>
          )}

          {step === "credentials" && (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="mt-6 w-full text-center text-sm text-[#6b9ae8] transition hover:text-[#4a6cf7]"
            >
              Forgot Password?
            </button>
          )}
        </div>
      </div>

      <div className="relative hidden flex-1 items-center justify-center bg-white px-10 py-12 lg:flex">
        <img
          src={LOGIN_ILLUSTRATION}
          srcSet={`${LOGIN_ILLUSTRATION} 350w, ${LOGIN_ILLUSTRATION_2X} 701w`}
          sizes="(min-width: 1024px) 42vw, 0px"
          width={350}
          height={394}
          alt=""
          decoding="sync"
          fetchPriority="high"
          draggable={false}
          className="h-auto w-full max-w-[350px] select-none"
        />
      </div>
    </div>
  );
}
