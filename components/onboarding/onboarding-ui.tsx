import type { InputHTMLAttributes, ReactNode } from "react";
import { Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { OnboardingStep } from "./onboarding-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ---- Step Indicator --------------------------------------------------------

interface StepConfig {
  number: OnboardingStep;
  label: string;
}

const STEPS: StepConfig[] = [
  { number: 1, label: "Profile" },
  { number: 2, label: "Workspace" },
  { number: 3, label: "Project" },
  { number: 4, label: "Members" },
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
                className={`absolute top-[18px] left-[calc(50%+18px)] right-[calc(-50%+18px)] h-[2px] transition-colors duration-300 z-0 ${isComplete ? "bg-white" : "bg-white/10"}`}
              />
            )}
            <button
              type="button"
              className={`w-9 h-9 rounded-full flex items-center justify-center text-[0.82rem] font-bold border-2 transition-all duration-300 relative z-10 ${
                isComplete
                  ? "border-white bg-white/20 text-white cursor-pointer hover:bg-white/30 hover:scale-105"
                  : isActive
                    ? "border-white bg-white text-black shadow-[0_0_15px_-3px_rgba(255,255,255,0.4)]"
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
              className={`text-[0.72rem] font-medium text-center whitespace-nowrap transition-colors duration-300 max-sm:hidden tracking-tight ${
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
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.98 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
      className="relative overflow-hidden border border-white/10 rounded-[24px] bg-[#0a0a0a]/70 shadow-[0_0_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-3xl p-8 max-sm:p-6"
    >
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30" />
      
      {/* Soft inner glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none rounded-[24px]" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full border border-white/10 bg-white/5 text-white/70 text-[0.72rem] font-semibold tracking-wider uppercase mb-5">
          {badge}
        </div>
        <h1 className="m-0 mb-2 font-display text-[clamp(1.6rem,4vw,2.2rem)] font-bold tracking-tighter text-[#ffffff] leading-tight">
          {title}
        </h1>
        <p className="text-white/60 text-[0.95rem] leading-relaxed m-0 mb-8 max-w-[90%] font-medium">
          {subtitle}
        </p>
        {children}
      </div>
    </motion.div>
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
    <div className="flex flex-col sm:flex-row gap-3 mt-8">
      {onSkip && (
        <Button
          type="button"
          variant="outline"
          className="order-2 sm:order-1 flex-1 sm:flex-none justify-center items-center min-h-[50px] px-6 border-white/10 bg-white/5 text-white/60 text-[0.95rem] font-medium transition-all duration-200 hover:bg-white/10 hover:text-white rounded-full"
          onClick={onSkip}
        >
          Skip for now
        </Button>
      )}
      <Button
        type="button"
        className="order-1 sm:order-2 flex-1 justify-center items-center min-h-[50px] border-none bg-white text-black text-[0.95rem] font-semibold transition-all duration-200 hover:bg-gray-200 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] disabled:opacity-50 rounded-full"
        onClick={onContinue}
        disabled={loading || disabled}
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
        {continueLabel}
      </Button>
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
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={id}
        className="text-white/80 text-[0.86rem] font-medium ml-1"
      >
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          className={`h-[50px] w-full border border-white/10 rounded-[14px] bg-white/[0.03] hover:bg-white/[0.05] text-white px-4 outline-none transition-all duration-300 placeholder:text-white/30 focus-visible:ring-4 focus-visible:ring-white/20 focus-visible:border-white/50 focus-visible:bg-white/[0.04] shadow-inner ${className || ""}`}
          {...props}
        />
      </div>
      {hint && (
        <p className="text-[0.78rem] text-muted-foreground mt-1 ml-1">{hint}</p>
      )}
    </div>
  );
}

// ---- Error alert -----------------------------------------------------------

export function OnboardingErrorAlert({ message }: { message: string }) {
  return (
    <div className="border border-destructive/50 rounded-xl bg-destructive/10 text-destructive text-[0.86rem] py-3 px-4 mt-4 shadow-sm">
      {message}
    </div>
  );
}
