import { AttentionItem, Probability, Impact } from "../types";

/**
 * Attention Score Algorithm (Principle 3: Weight by probability × impact)
 *
 * Design philosophy:
 * - Low-anything should be filtered out or relegated
 * - High-high gets prioritized
 * - Score = probability × impact (true multiplication)
 *
 * Probability weights reflect "if not addressed, how likely something goes wrong":
 * - low: 0.1 (10% chance - barely worth attention)
 * - medium: 0.5 (50% chance - coin flip, worth watching)
 * - high: 0.9 (90% chance - almost certain to go wrong)
 *
 * Impact weights reflect severity if it does go wrong:
 * - low: 1 (minor inconvenience)
 * - medium: 5 (significant but recoverable)
 * - high: 10 (severe, hard to recover from)
 *
 * Score examples:
 * - low × low = 0.1 × 1 = 0.1 (filtered)
 * - low × high = 0.1 × 10 = 1.0 (filtered - low probability means not urgent)
 * - medium × medium = 0.5 × 5 = 2.5 (borderline)
 * - medium × high = 0.5 × 10 = 5.0 (attention worthy)
 * - high × medium = 0.9 × 5 = 4.5 (attention worthy)
 * - high × high = 0.9 × 10 = 9.0 (critical priority)
 */

const PROBABILITY_WEIGHTS: Record<Probability, number> = {
  high: 0.9,
  medium: 0.5,
  low: 0.1,
};

const IMPACT_WEIGHTS: Record<Impact, number> = {
  high: 10,
  medium: 5,
  low: 1,
};

// Score threshold - items below this are not attention-worthy
// medium × medium (2.5) is borderline, medium × high (5.0) passes
const ATTENTION_THRESHOLD = 3;

/**
 * Calculate attention score for an item based on probability × impact
 *
 * This implements Principle 3: "High-high gets prioritized. Low-anything
 * gets filtered out or relegated."
 *
 * Score range: 0.1 to 9.0
 * - Below 3: Not attention-worthy (filtered)
 * - 3-5: Worth watching
 * - 5-7: Needs attention soon
 * - 7+: Critical, address immediately
 */
export function calculateAttentionScore(item: AttentionItem): number {
  const probability = item.probability || "low";
  const impact = item.impact || "low";

  const baseScore = PROBABILITY_WEIGHTS[probability] * IMPACT_WEIGHTS[impact];

  // Bonus multipliers for urgency signals (additive to base, capped)
  let urgencyBonus = 0;

  // Items needing a decision get slight priority boost
  if (item.needsDecision) {
    urgencyBonus += 0.5;
  }

  // Items needing intervention are inherently more urgent
  if (item.needsIntervention) {
    urgencyBonus += 0.3;
  }

  return baseScore + urgencyBonus;
}

/**
 * Sort items by attention score in descending order (highest priority first)
 */
export function sortByAttentionScore(items: AttentionItem[]): AttentionItem[] {
  return [...items].sort((a, b) => {
    const scoreA = calculateAttentionScore(a);
    const scoreB = calculateAttentionScore(b);

    // Primary sort: by score (descending)
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }

    // Secondary sort: needsDecision items come first
    if (a.needsDecision !== b.needsDecision) {
      return a.needsDecision ? -1 : 1;
    }

    // Tertiary sort: needsIntervention items come next
    if (a.needsIntervention !== b.needsIntervention) {
      return a.needsIntervention ? -1 : 1;
    }

    return 0;
  });
}

/**
 * Filter items that require attention
 *
 * Implements Principle 2: Only surface what demands intervention
 * "Status updates, completed jobs, things going well—none of these belong
 * in prime real estate. Status by exception: if something is on track, don't tell me."
 *
 * Two categories ONLY:
 * - Needs your attention: A risk/issue that could go wrong (needsIntervention)
 * - Needs your decision: Something blocked until you weigh in (needsDecision)
 *
 * Combined with Principle 3: Low-anything gets filtered out
 */
export function filterForAttentionPane(
  items: AttentionItem[],
): AttentionItem[] {
  return items.filter((item) => {
    // STRICT GATE 1: Must need intervention OR decision
    // If neither flag is set, this is just a status update - filter it out
    if (!item.needsIntervention && !item.needsDecision) {
      return false;
    }

    // STRICT GATE 2: Must meet probability × impact threshold
    // Low-anything scores below threshold and gets filtered
    const score = calculateAttentionScore(item);
    if (score < ATTENTION_THRESHOLD) {
      return false;
    }

    return true;
  });
}

/**
 * Get items grouped by type (for UI organization)
 */
export function groupByAttentionType(items: AttentionItem[]): {
  needsDecision: AttentionItem[];
  needsIntervention: AttentionItem[];
  other: AttentionItem[];
} {
  const needsDecision: AttentionItem[] = [];
  const needsIntervention: AttentionItem[] = [];
  const other: AttentionItem[] = [];

  for (const item of items) {
    if (item.needsDecision) {
      needsDecision.push(item);
    } else if (item.needsIntervention) {
      needsIntervention.push(item);
    } else {
      other.push(item);
    }
  }

  return { needsDecision, needsIntervention, other };
}

/**
 * Get score label for display
 * Aligned with the new multiplicative scoring:
 * - 7+: Critical (high × high territory)
 * - 5-7: High (medium × high or high × medium)
 * - 3-5: Medium (attention-worthy but not urgent)
 * - Below 3: Low (should be filtered out)
 */
export function getScoreLabel(score: number): string {
  if (score >= 7) return "Critical";
  if (score >= 5) return "High";
  if (score >= 3) return "Medium";
  return "Low";
}

/**
 * Check if an item should surface in the attention pane
 * Implements Principle 2: Only surface what demands intervention
 *
 * Two categories belong in the attention pane:
 * - Needs your attention: A risk or issue that could go wrong (needsIntervention)
 * - Needs your decision: Something blocked until you weigh in (needsDecision)
 */
export function isAttentionWorthy(item: AttentionItem): boolean {
  // STRICT: Must have intervention OR decision flag
  if (!item.needsIntervention && !item.needsDecision) {
    return false;
  }

  // Must meet score threshold (low-anything gets filtered)
  const score = calculateAttentionScore(item);
  return score >= ATTENTION_THRESHOLD;
}

/**
 * Get relative time string from timestamp
 */
export function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
