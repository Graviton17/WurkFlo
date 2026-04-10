"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { signupAction } from "@/app/actions/auth.actions";
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

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        router.replace("/onboarding");
      }
    };
    checkSession();
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signupAction({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });

      if (!result.success) {
        setError(result.error || "Failed to sign up");
        setLoading(false);
      } else {
        router.push("/onboarding");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up");
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
        title="Create an Account"
        subtitle="Get started with WurkFlo today"
      >
        <form className="space-y-5" onSubmit={handleSignup}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AuthField
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              label="First name"
              icon={<User className="h-5 w-5" />}
              placeholder="First"
            />
            <AuthField
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              label="Last name"
              icon={<User className="h-5 w-5" />}
              placeholder="Last"
            />
          </div>

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

          <AuthField
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            icon={<Lock className="h-5 w-5" />}
            placeholder="••••••••"
          />

          {error && <AuthErrorAlert message={error} />}

          <div className="pt-2">
            <AuthSubmitButton loading={loading} text="Sign up" />
          </div>
        </form>

        <AuthDivider text="Or continue with" />
        <AuthOAuthButton onClick={handleGoogleSignup} label="Google" />
        <AuthFooterLink
          text="Already have an account?"
          href="/login"
          cta="Sign in"
        />
      </AuthCardShell>
    </AuthPageLayout>
  );
}
