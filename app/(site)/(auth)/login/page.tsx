"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Mail, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction, sendMagicLinkAction } from "@/app/actions/auth.actions";
import {
  AuthPageLayout,
  AuthCardShell,
  AuthDivider,
  AuthErrorAlert,
  AuthField,
  AuthFooterLink,
  AuthOAuthButton,
  AuthSubmitButton,
} from "@/components/auth";

type LoginMode = "password" | "magic-link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<LoginMode>("password");
  const [linkSent, setLinkSent] = useState(false);
  const router = useRouter();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        router.replace("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await loginAction({ email, password });

      if (!result.success) {
        setError(result.error || "Failed to sign in");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in");
      setLoading(false);
    }
  };

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await sendMagicLinkAction({ email });

      if (!result.success) {
        setError(result.error || "Failed to send login link");
        setLoading(false);
      } else {
        setLinkSent(true);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout>
      <AuthCardShell
        title="Welcome Back"
        subtitle="Sign in to your WurkFlo account"
      >
        {/* Mode Toggle */}
        <div className="flex rounded-full bg-white/5 border border-white/10 p-1 mb-6">
          <button
            type="button"
            onClick={() => { setMode("password"); setError(null); setLinkSent(false); }}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
              mode === "password"
                ? "bg-[#ff1f1f] text-white shadow-lg shadow-[#ff1f1f]/20"
                : "text-white/50 hover:text-white/70"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => { setMode("magic-link"); setError(null); setLinkSent(false); }}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
              mode === "magic-link"
                ? "bg-[#ff1f1f] text-white shadow-lg shadow-[#ff1f1f]/20"
                : "text-white/50 hover:text-white/70"
            }`}
          >
            Email Link
          </button>
        </div>

        {mode === "password" ? (
          /* ── Password Login ── */
          <form className="space-y-5" onSubmit={handleLogin}>
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

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white/90"
                  style={{ marginBottom: 0 }}
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-white/60 text-sm transition-colors hover:text-white"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="mt-1">
                <AuthField
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
                  hideLabel
                  icon={<Lock className="h-5 w-5" />}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <AuthErrorAlert message={error} />}

            <div className="pt-2">
              <AuthSubmitButton loading={loading} text="Sign in" />
            </div>
          </form>
        ) : linkSent ? (
          /* ── Link Sent Confirmation ── */
          <div className="space-y-5 py-4">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Check your email</h3>
                <p className="text-white/50 text-sm mt-1.5 leading-relaxed">
                  We sent a sign-in link to<br />
                  <span className="text-white/70 font-medium">{email}</span>
                </p>
              </div>
              <p className="text-white/40 text-xs">
                Click the link in the email to sign in automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setLinkSent(false); setError(null); }}
              className="w-full text-center text-white/50 text-sm transition-colors hover:text-white cursor-pointer"
            >
              Use a different email
            </button>
          </div>
        ) : (
          /* ── Magic Link Form ── */
          <form className="space-y-5" onSubmit={handleSendLink}>
            <AuthField
              id="magic-email"
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

            <p className="text-white/40 text-sm">
              We&apos;ll send a sign-in link to your email. No password needed.
            </p>

            {error && <AuthErrorAlert message={error} />}

            <div className="pt-2">
              <AuthSubmitButton loading={loading} text="Send sign-in link" />
            </div>
          </form>
        )}

        <AuthDivider text="Or continue with" />
        <AuthOAuthButton onClick={handleGoogleLogin} label="Google" />
        <AuthFooterLink
          text="Don't have an account?"
          href="/signup"
          cta="Sign up"
        />
      </AuthCardShell>
    </AuthPageLayout>
  );
}
