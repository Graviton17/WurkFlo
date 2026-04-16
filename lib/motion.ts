import type { Variants, Transition } from "framer-motion";

// ─── Shared spring transition ────────────────────────────────────────────────
export const spring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 24,
};

export const gentleSpring: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
};

// ─── Entrance presets ────────────────────────────────────────────────────────

/** Fade in + slide up (default section/card entrance) */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/** Simple fade */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

/** Scale in (dialogs, modals) */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
};

// ─── Stagger presets ─────────────────────────────────────────────────────────

/** Parent container that staggers children */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
      ease: "easeOut",
    },
  },
};

/** Child item for stagger list (fade + slide up) */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

// ─── Page-level entrance ─────────────────────────────────────────────────────

/** Wraps entire page content with a single entrance */
export const pageEntrance: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};
