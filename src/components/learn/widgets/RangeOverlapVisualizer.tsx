"use client";

import { useState } from "react";
import { WidgetFrame } from "./WidgetFrame";

type Mode = "tight" | "messy";

type Props = {
  /** Which architecture pattern to render first. Defaults to `tight`. */
  mode?: Mode;
};

type RangeRow = { level: string; min: number; max: number };

const TIGHT: RangeRow[] = [
  { level: "P3 Proficient", min: 80, max: 110 },
  { level: "P4 Advanced", min: 100, max: 135 },
  { level: "P5 Expert", min: 125, max: 165 },
  { level: "P6 Principal", min: 155, max: 200 },
];

// In the messy version, ranges sprawl. P3 and P5 overlap. The level loses its
// pricing identity because the bands are too wide.
const MESSY: RangeRow[] = [
  { level: "P3 Proficient", min: 80, max: 145 },
  { level: "P4 Advanced", min: 90, max: 170 },
  { level: "P5 Expert", min: 110, max: 195 },
  { level: "P6 Principal", min: 130, max: 220 },
];

const FOOTNOTE =
  "Illustrative ranges. Your structure will look different. The teaching point is the range shape.";

const SCALE_MIN = 70;
const SCALE_MAX = 230;

export function RangeOverlapVisualizer({ mode = "tight" }: Props) {
  return (
    <WidgetFrame
      caption="What range overlap teaches"
      footer={<span>{FOOTNOTE}</span>}
      fallback={<RangeFallback />}
    >
      <RangeInteractive initial={mode} />
    </WidgetFrame>
  );
}

function RangeInteractive({ initial }: { initial: Mode }) {
  const [active, setActive] = useState<Mode>(initial);
  const data = active === "tight" ? TIGHT : MESSY;

  return (
    <div>
      <div
        className="inline-flex rounded-[var(--radius-card)] border p-1"
        role="group"
        aria-label="Architecture pattern"
        style={{
          background: "var(--surface-alt)",
          borderColor: "var(--line)",
        }}
      >
        {(["tight", "messy"] as const).map((m) => {
          const selected = m === active;
          return (
            <button
              key={m}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(m)}
              className="rounded-[8px] px-3 py-2 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: selected ? "var(--accent-soft)" : "transparent",
                color: selected ? "var(--text)" : "var(--text-muted)",
                outlineColor: "var(--accent)",
                minHeight: "44px",
                minWidth: "44px",
              }}
            >
              {m === "tight" ? "Tight architecture" : "Messy architecture"}
            </button>
          );
        })}
      </div>

      <p
        role="status"
        aria-live="polite"
        className="mt-3 text-sm leading-6"
        style={{ color: "var(--muted)" }}
      >
        {active === "tight"
          ? "Adjacent levels overlap a little. Movement between levels reads as a real change."
          : "Levels sprawl into each other. Two people two levels apart can earn the same number."}
      </p>

      <ul className="mt-4 space-y-3">
        {data.map((row) => {
          const left = ((row.min - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;
          const width =
            ((row.max - row.min) / (SCALE_MAX - SCALE_MIN)) * 100;
          return (
            <li key={row.level} className="text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <span>{row.level}</span>
                <span
                  className="font-mono text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  ${row.min}k to ${row.max}k
                </span>
              </div>
              <div
                aria-hidden="true"
                className="relative mt-1 h-3 w-full rounded-full"
                style={{ background: "var(--surface-alt)" }}
              >
                <div
                  className="absolute h-full rounded-full"
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    background: "var(--accent)",
                    transition: "left 200ms ease, width 200ms ease",
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function RangeFallback() {
  return (
    <div>
      <p className="text-sm leading-6">
        Two architecture patterns, side by side. The teaching point: clean
        architecture makes overlap intentional and explainable, messy
        architecture makes overlap hard to defend.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <StaticPattern title="Tight architecture" rows={TIGHT} />
        <StaticPattern title="Messy architecture" rows={MESSY} />
      </div>
    </div>
  );
}

function StaticPattern({ title, rows }: { title: string; rows: RangeRow[] }) {
  return (
    <div
      className="rounded-[var(--radius-card)] border p-3"
      style={{
        background: "var(--surface-alt)",
        borderColor: "var(--line)",
      }}
    >
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-2 space-y-1 text-xs" style={{ color: "var(--muted)" }}>
        {rows.map((r) => (
          <li key={r.level} className="flex justify-between gap-3">
            <span style={{ color: "var(--text)" }}>{r.level}</span>
            <span className="font-mono">
              ${r.min}k to ${r.max}k
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
