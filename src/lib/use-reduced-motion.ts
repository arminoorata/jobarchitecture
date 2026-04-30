"use client";

import { useEffect, useState } from "react";

/**
 * Read the user's `prefers-reduced-motion` setting. Returns `true` when the
 * user has asked the OS to dial motion back, or when we're on the server (so
 * the static fallback wins on first paint and there's no animation flash).
 *
 * Widgets pair this with `WidgetFrame`'s `fallback` slot: when the hook says
 * `true`, render the no-motion equivalent instead of the interactive view.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);

    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }
    // Older Safari path.
    mql.addListener(handler);
    return () => mql.removeListener(handler);
  }, []);

  return reduced;
}
