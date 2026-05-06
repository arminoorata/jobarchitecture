"use client";

import { type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  /** Optional eyebrow caption above the body. */
  caption?: string;
  /** Optional footer content (sources, footnote, attribution). */
  footer?: ReactNode;
  /**
   * Static, no-motion equivalent of the widget. Rendered on the server and
   * for users who set `prefers-reduced-motion: reduce`. Per spec §5.3 every
   * widget must have one.
   */
  fallback: ReactNode;
  /**
   * When `true`, breaks out of the 720px reading-narrow container to the
   * 1152px page-narrow container so the widget can use side-by-side layouts.
   * Used by TrackComparator (role-shape) and CalibrationCompare per §16.5.
   */
  wide?: boolean;
  children: ReactNode;
};

/**
 * Shared wrapper for every interactive widget.
 *
 * - Provides the bordered card surface (surface bg, line border, 10px radius,
 *   subtle shadow) so widgets don't all reinvent chrome.
 * - Renders a static `fallback` for SSR and for `prefers-reduced-motion: reduce`.
 *   On the server (and on the first client paint before the media query
 *   resolves), the fallback wins so there's no motion flash.
 * - Optional `caption` header and `footer` slots for sources or footnotes.
 * - `wide` lets the widget escape the 720px reading column and use the full
 *   1152px page width for side-by-side comparisons.
 */
export function WidgetFrame({
  caption,
  footer,
  fallback,
  wide,
  children,
}: Props) {
  const reduced = useReducedMotion();
  const body = reduced ? fallback : children;

  // The `wide` flag was an attempt to break out of the 720px reading column
  // into the 1152px page-narrow container for side-by-side tables. The
  // viewport-relative breakout combo (left-1/2 + right-1/2 + -mx-[50vw] +
  // w-screen) renders unreliably across viewport widths and was visibly
  // truncating tables on the live site. The role-shape and calibration
  // tables both fit inside 720px (their min-widths are 640px and 560px), so
  // the prop is now a no-op. Kept on the type so existing callsites compile.
  void wide;
  return (
    <figure className="my-2">
      <div
        className="rounded-[var(--radius-card)] border shadow-sm"
        style={{
          background: "var(--surface)",
          borderColor: "var(--line)",
        }}
      >
        {caption ? (
          <figcaption
            className="border-b px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] md:px-5"
            style={{
              borderColor: "var(--line)",
              color: "var(--accent)",
            }}
          >
            {caption}
          </figcaption>
        ) : null}
        <div className="p-4 md:p-5">{body}</div>
        {footer ? (
          <div
            className="border-t px-4 py-3 text-xs leading-5 md:px-5"
            style={{
              borderColor: "var(--line)",
              color: "var(--text-muted)",
            }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </figure>
  );
}
