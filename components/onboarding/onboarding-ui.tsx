import type { InputHTMLAttributes, ReactNode } from "react";
import { Check, Loader2 } from "lucide-react";
import type { OnboardingStep } from "./onboarding-context";

// ---- Step Indicator --------------------------------------------------------

interface StepConfig {
  number: OnboardingStep;
  label: string;
}

const STEPS: StepConfig[] = [
  { number: 1, label: "Profile" },
  { number: 2, label: "Workspace" },
  { number: 3, label: "Members" },
  { number: 4, label: "Project" },
];

interface StepIndicatorProps {
  current: OnboardingStep;
  onStepClick?: (step: OnboardingStep) => void;
}

export function StepIndicator({ current, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full mb-0 max-sm:hidden">
      {STEPS.map((step) => {
        const isComplete = step.number < current;
        const isActive = step.number === current;

        return (
          <div
            key={step.number}
            className={`flex flex-col items-center gap-2 relative flex-1 ${isComplete ? "group" : ""}`}
          >
            {step.number !== STEPS.length && (
              <div
                className={`absolute top-[18px] left-[calc(50%+18px)] right-[calc(-50%+18px)] h-[2px] transition-colors duration-300 z-0 ${isComplete ? "bg-[#ff1f1f]" : "bg-white/10"}`}
              />
            )}
            <button
              type="button"
              className={`w-9 h-9 rounded-full flex items-center justify-center text-[0.82rem] font-bold border-2 transition-all duration-300 relative z-10 ${
                isComplete
                  ? "border-[#ff1f1f] bg-[#ff1f1f]/20 text-[#ff1f1f] cursor-pointer hover:bg-[#ff1f1f]/30 hover:scale-108"
                  : isActive
                    ? "border-[#ff1f1f] bg-[#ff1f1f] text-white shadow-[0_0_0_4px_rgba(255,31,31,0.2)]"
                    : "border-white/10 bg-[#151519]/90 text-white/50 cursor-default"
              }`}
              onClick={() => isComplete && onStepClick?.(step.number)}
              aria-label={`Step ${step.number}: ${step.label}${isComplete ? " (completed)" : ""}`}
              aria-current={isActive ? "step" : undefined}
            >
              {isComplete ? (
                <Check className="w-[14px] h-[14px]" strokeWidth={3} />
              ) : (
                step.number
              )}
            </button>
            <span
              className={`text-[0.72rem] font-medium text-center whitespace-nowrap transition-colors duration-300 max-sm:hidden ${
                isActive || isComplete ? "text-white" : "text-white/50"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---- Onboarding Shell (card wrapper) ---------------------------------------

interface OnboardingShellProps {
  badge: string;
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
}

export function OnboardingShell({
  badge,
  title,
  subtitle,
  children,
}: OnboardingShellProps) {
  return (
    <div className="border border-white/10 rounded-[20px] bg-gradient-to-b from-[#151519]/95 to-[#101011]/92 shadow-2xl backdrop-blur-md py-9 px-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-sm:p-6 max-sm:rounded-2xl">
      <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full border border-white/10 bg-white/5 text-white/60 text-[0.72rem] font-semibold tracking-wide uppercase mb-4">
        {badge}
      </div>
      <h1 className="m-0 mb-2 font-display text-[clamp(1.55rem,3.5vw,1.9rem)] font-bold tracking-tight text-[#f0f0f0]">
        {title}
      </h1>
      <p className="text-white/60 text-[0.93rem] leading-relaxed m-0 mb-7">
        {subtitle}
      </p>
      {children}
    </div>
  );
}

// ---- Nav Buttons -----------------------------------------------------------

interface NavButtonsProps {
  onContinue: () => void;
  onSkip?: () => void;
  loading?: boolean;
  continueLabel?: string;
  disabled?: boolean;
}

export function NavButtons({
  onContinue,
  onSkip,
  loading = false,
  continueLabel = "Continue",
  disabled = false,
}: NavButtonsProps) {
  return (
    <div className="flex gap-3 mt-8">
      {onSkip && (
        <button
          type="button"
          className="inline-flex justify-center items-center min-h-[50px] px-5 border border-white/10 rounded-xl bg-white/5 text-white/60 text-[0.9rem] font-medium cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-white/10 hover:-translate-y-px"
          onClick={onSkip}
        >
          Skip for now
        </button>
      )}
      <button
        type="button"
        className="flex-1 inline-flex justify-center items-center min-h-[50px] border border-[#ff1f1f] rounded-xl bg-[#ff1f1f] text-white text-[0.95rem] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#ff1f1f]/90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onContinue}
        disabled={loading || disabled}
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : continueLabel}
      </button>
    </div>
  );
}

// ---- Onboarding Input ------------------------------------------------------

type OnboardingInputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
};

export function OnboardingInput({
  id,
  label,
  hint,
  className,
  ...props
}: OnboardingInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="block text-white/60 text-[0.86rem] font-medium"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={`relative z-0 w-full border border-white/10 rounded-md bg-gradient-to-b from-[#222225]/90 to-[#28282e]/95 text-white py-3 pr-4 pl-[0.95rem] outline-none transition-all duration-300 placeholder:text-white/30 focus:border-[#ff1f1f] focus:ring-4 focus:ring-[#ff1f1f]/15 focus:-translate-y-px ${className || ""}`}
          {...props}
        />
      </div>
      {hint && (
        <p className="text-[0.78rem] text-muted-foreground mt-1">{hint}</p>
      )}
    </div>
  );
}

// ---- Error alert -----------------------------------------------------------

export function OnboardingErrorAlert({ message }: { message: string }) {
  return (
    <div className="border border-destructive rounded-xl bg-destructive/10 text-destructive text-[0.86rem] py-3 px-3.5 mt-3">
      {message}
    </div>
  );
}
