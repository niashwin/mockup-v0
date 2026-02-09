// Spring configurations for consistent animations throughout the app
// Synchro-style: snappier springs, subtler interactions, no blur

export const springs = {
  // Micro-interactions: buttons, toggles, checkboxes
  quick: { type: "spring" as const, stiffness: 500, damping: 35 },

  // Snappy content transitions
  snappy: { type: "spring" as const, stiffness: 400, damping: 32 },

  // Standard UI transitions: panels, dropdowns, modals
  default: { type: "spring" as const, stiffness: 350, damping: 32 },

  // Content reveals: page sections, card grids
  gentle: { type: "spring" as const, stiffness: 250, damping: 28 },

  // Page-level: route transitions, large panels
  page: { type: "spring" as const, stiffness: 200, damping: 25 },
};

// Staggered content reveals — no blur, subtler movement
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle,
  },
};

// Fade variants
export const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Slide up variants
export const slideUpVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

// Slide in from right variants
export const slideInRightVariants = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 8 },
};

// Scale fade for popovers
export const popoverVariants = {
  initial: { opacity: 0, scale: 0.97, y: 6 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: 3 },
};

// Modal overlay
export const modalOverlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Modal content
export const modalContentVariants = {
  initial: { opacity: 0, scale: 0.97, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: 4 },
};

// Card grid stagger
export const cardGridContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.06,
    },
  },
};

export const cardGridItem = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle,
  },
};
