import type { Variants } from 'framer-motion'

// Shared easing — expo-out feel for entrances, easeIn for exits
export const EASE_OUT = [0.22, 1, 0.36, 1] as const
export const EASE_IN = [0.4, 0, 1, 1] as const

// ─── Page Transitions ──────────────────────────────────────────────────────
export const PAGE_TRANSITION: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.28, ease: EASE_IN },
  },
}

// ─── Doorway Cards ─────────────────────────────────────────────────────────
export const DOORWAY_ENTRANCE: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
}

// ─── Panel Entrance (staggered) ────────────────────────────────────────────
export const PANEL_ENTRANCE: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.45,
      ease: EASE_OUT,
    },
  }),
}

// ─── List Item (tasks, entries) ────────────────────────────────────────────
export const LIST_ITEM: Variants = {
  initial: { opacity: 0, x: -8, height: 0 },
  animate: {
    opacity: 1,
    x: 0,
    height: 'auto',
    transition: { duration: 0.25, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    x: 8,
    height: 0,
    transition: { duration: 0.2, ease: EASE_IN },
  },
}

// ─── Stagger Container ─────────────────────────────────────────────────────
export const STAGGER_CONTAINER: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
}

// ─── Lantern Glow Pulse ────────────────────────────────────────────────────
export const LANTERN_GLOW: Variants = {
  idle: {
    filter: 'drop-shadow(0 0 6px rgba(245,200,66,0.5))',
    scale: 1,
  },
  pulse: {
    filter: 'drop-shadow(0 0 16px rgba(245,200,66,0.9))',
    scale: 1.08,
    transition: {
      duration: 2.4,
      repeat: Infinity,
      repeatType: 'mirror',
      ease: 'easeInOut',
    },
  },
}

// ─── Fade In Simple ────────────────────────────────────────────────────────
export const FADE_IN: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}
