"use client";

import { useSyncExternalStore } from "react";

/**
 * Read the user's `prefers-reduced-motion` setting. Returns `true` when the
 * user has asked the OS to dial motion back, or when we're on the server (so
 * the static fallback wins on first paint and there's no animation flash).
 *
 * Widgets pair this with `WidgetFrame`'s `fallback` slot: when the hook says
 * `true`, render the no-motion equivalent instead of the interactive view.
 *
 * Uses `useSyncExternalStore` so the subscription happens via the React
 * external-store API rather than a `setState`-in-`useEffect` pattern (which
 * the React Hooks lint rule flags as cascading-render risky).
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function subscribe(notify: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (typeof mql.addEventListener === "function") {
    mql.addEventListener("change", notify);
    return () => mql.removeEventListener("change", notify);
  }
  // Older Safari path.
  mql.addListener(notify);
  return () => mql.removeListener(notify);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot(): boolean {
  // Static fallback wins on first paint.
  return true;
}
