import type { InputHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Layout wrapper for Auth pages
export function AuthPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 w-full min-h-[100dvh] flex flex-col justify-center items-center py-12 px-4 relative overflow-hidden bg-auth-pattern">
      <div className="absolute top-[33%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff1f1f]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3c00ff]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="relative z-10 w-full max-w-[440px]">{children}</div>
    </div>
  );
}

type AuthCardShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthCardShell({
  title,
  subtitle,
  children,
}: AuthCardShellProps) {
  return (
    <Card className="bg-[#0c0c0d]/70 border border-white/10 backdrop-blur-md text-white shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white text-2xl font-semibold text-center">
          {title}
        </CardTitle>
        <CardDescription className="text-white/60 text-center text-[0.95rem] mt-1">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  icon: ReactNode;
  hideLabel?: boolean;
};

export function AuthField({
  id,
  label,
  icon,
  hideLabel = false,
  className,
  ...props
}: AuthFieldProps) {
  return (
    <div>
      {!hideLabel && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-white/90 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
          {icon}
        </span>
        <input
          id={id}
          className={`w-full bg-white/5 border border-white/10 text-white rounded-md py-2.5 pr-3 pl-11 outline-none transition-all duration-200 text-[0.95rem] focus:border-[#ff1f1f] focus:bg-white/5 focus:ring-1 focus:ring-[#ff1f1f]/20 placeholder:text-white/30 ${className || ""}`}
          {...props}
        />
      </div>
    </div>
  );
}

type AuthSubmitButtonProps = {
  loading: boolean;
  text: string;
};

export function AuthSubmitButton({ loading, text }: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="!bg-[#ff1f1f] !text-white w-full h-11 text-base rounded-full transition-all duration-200 hover:!bg-[#ff1f1f]/90 hover:shadow-[0_0_20px_-5px_#ff1f1f]"
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : text}
    </Button>
  );
}

type AuthErrorAlertProps = {
  message: string;
};

export function AuthErrorAlert({ message }: AuthErrorAlertProps) {
  return (
    <div className="bg-[#ff1f1f]/10 border border-[#ff1f1f]/30 text-[#ff4d4d] p-3 rounded-md text-sm text-center">
      {message}
    </div>
  );
}

type AuthDividerProps = {
  text: string;
};

export function AuthDivider({ text }: AuthDividerProps) {
  return (
    <div className="flex items-center my-6">
      <div className="flex-1 h-px bg-white/10" />
      <span className="px-3 text-white/40 text-xs uppercase tracking-widest">
        {text}
      </span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

type AuthOAuthButtonProps = {
  onClick: () => void;
  label: string;
};

export function AuthOAuthButton({ onClick, label }: AuthOAuthButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex w-full items-center justify-center gap-2 bg-white/5 border border-white/10 text-white rounded-full py-2.5 transition-all duration-200 cursor-pointer text-[0.95rem] font-medium hover:bg-white/10"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
          fill="#EA4335"
        />
        <path
          d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
          fill="#4285F4"
        />
        <path
          d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
          fill="#FBBC05"
        />
        <path
          d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
          fill="#34A853"
        />
      </svg>
      <span>{label}</span>
    </button>
  );
}

export function AuthFooterLink({
  text,
  href,
  cta,
}: {
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="mt-6 text-center text-sm text-white/60">
      <span>{text}</span>
      <Link
        href={href}
        className="text-white font-medium ml-1.5 transition-colors hover:text-[#ff1f1f]"
      >
        {cta}
      </Link>
    </div>
  );
}
