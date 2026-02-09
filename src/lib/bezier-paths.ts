/**
 * Bezier Path Utilities
 *
 * Functions for calculating smooth bezier curves between points,
 * used for drawing connection lines between cards in the timeline.
 */

export interface Point {
  x: number;
  y: number;
}

/**
 * Calculate a smooth bezier curve path between two points.
 * Uses horizontal control points for a natural horizontal flow.
 *
 * @param from - Starting point (right edge of source card)
 * @param to - Ending point (left edge of target card)
 * @returns SVG path d attribute string
 */
export function calculateBezierPath(from: Point, to: Point): string {
  const dx = to.x - from.x;

  // Control point offset - 40% of horizontal distance, capped at 120px
  // This creates smooth curves that work for both short and long distances
  const controlOffset = Math.min(Math.abs(dx) * 0.4, 120);

  // Handle cards that might be in reverse order (target to the left of source)
  const controlX1 = from.x + (dx > 0 ? controlOffset : -controlOffset);
  const controlX2 = to.x - (dx > 0 ? controlOffset : -controlOffset);

  return `M ${from.x} ${from.y} C ${controlX1} ${from.y}, ${controlX2} ${to.y}, ${to.x} ${to.y}`;
}
