"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth.actions";
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // If user is already logged in, redirect to dashboard (server-side redirect handles routing)
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
                href="/forgot-password"
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
