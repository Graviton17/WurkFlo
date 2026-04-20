"use client";

import { useState } from "react";
import { Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "@/app/actions/auth.actions";
import {
  AuthPageLayout,
  AuthCardShell,
  AuthErrorAlert,
  AuthField,
  AuthSubmitButton,
} from "@/components/auth";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await resetPasswordAction({ password, confirmPassword });

      if (!result.success) {
        setError(result.error || "Failed to reset password");
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout>
      <AuthCardShell
        title="Set New Password"
        subtitle={
          success
            ? "You're all set"
            : "Choose a strong password for your account"
        }
      >
        {success ? (
          <div className="space-y-5">
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
                <CheckCircle2 className="h-7 w-7 text-emerald-400" />
              </div>
              <p className="text-center text-sm text-white/70 leading-relaxed max-w-[320px]">
                Your password has been reset successfully. Redirecting you to
                sign in...
              </p>
            </div>

            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 bg-[#ff1f1f] text-white rounded-full py-2.5 text-base font-medium transition-all duration-200 hover:bg-[#ff1f1f]/90 hover:shadow-[0_0_20px_-5px_#ff1f1f]"
            >
              Sign in now
            </Link>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <AuthField
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="New password"
              icon={<Lock className="h-5 w-5" />}
              placeholder="••••••••"
            />

            <AuthField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              label="Confirm new password"
              icon={<Lock className="h-5 w-5" />}
              placeholder="••••••••"
            />

            {error && <AuthErrorAlert message={error} />}

            <div className="pt-2">
              <AuthSubmitButton loading={loading} text="Reset password" />
            </div>
          </form>
        )}
      </AuthCardShell>
    </AuthPageLayout>
  );
}
