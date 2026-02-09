import { useState, useEffect } from "react";
import { getCountdownString, getCountdownWithTime } from "@lib/date-utils";
import type { Meeting } from "@types/meeting";

/**
 * Hook for real-time countdown updates
 * Updates every minute to show accurate countdown
 */
export function useCountdown(meeting: Meeting): string {
  const [countdown, setCountdown] = useState(() => getCountdownString(meeting));

  useEffect(() => {
    // Update immediately
    setCountdown(getCountdownString(meeting));

    // Update every minute
    const interval = setInterval(() => {
      setCountdown(getCountdownString(meeting));
    }, 60000);

    return () => clearInterval(interval);
  }, [meeting]);

  return countdown;
}

/**
 * Hook for real-time countdown with time display
 * e.g., "In 15 mins (2:00 PM)"
 */
export function useCountdownWithTime(meeting: Meeting): string {
  const [countdown, setCountdown] = useState(() =>
    getCountdownWithTime(meeting),
  );

  useEffect(() => {
    // Update immediately
    setCountdown(getCountdownWithTime(meeting));

    // Update every minute
    const interval = setInterval(() => {
      setCountdown(getCountdownWithTime(meeting));
    }, 60000);

    return () => clearInterval(interval);
  }, [meeting]);

  return countdown;
}
