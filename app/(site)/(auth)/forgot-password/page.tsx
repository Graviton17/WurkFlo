"use client";

import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { forgotPasswordAction } from "@/app/actions/auth.actions";
import {
  AuthPageLayout,
  AuthCardShell,
  AuthErrorAlert,
  AuthField,
  AuthSubmitButton,
} from "@/components/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await forgotPasswordAction({ email });

      if (!result.success) {
        setError(result.error || "Failed to send reset email");
        setLoading(false);
      } else {
        setSubmitted(true);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout>
      <AuthCardShell
        title="Reset Password"
        subtitle={
          submitted
            ? "Check your inbox"
            : "Enter your email to receive a reset link"
        }
      >
        {submitted ? (
          <div className="space-y-5">
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
                <CheckCircle2 className="h-7 w-7 text-emerald-400" />
              </div>
              <p className="text-center text-sm text-white/70 leading-relaxed max-w-[320px]">
                If an account exists for{" "}
                <span className="font-medium text-white">{email}</span>, we've
                sent a password reset link. Please check your email and
                spam folder.
              </p>
            </div>

            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <AuthField
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email address"
                icon={<Mail className="h-5 w-5" />}
                placeholder="you@example.com"
              />

              {error && <AuthErrorAlert message={error} />}

              <div className="pt-2">
                <AuthSubmitButton loading={loading} text="Send reset link" />
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </AuthCardShell>
    </AuthPageLayout>
  );
}
