"use client";

import { useId, useState } from "react";
import { WidgetFrame } from "./WidgetFrame";

type SupportedTitle =
  | "Senior Engineer"
  | "Senior Manager"
  | "Director"
  | "VP"
  | "Principal";

type Props = {
  /** Which title to inspect on first render. Defaults to "Director". */
  title?: SupportedTitle;
};

type Distribution = {
  title: SupportedTitle;
  blurb: string;
  // Each entry: human label, percentage 0..100. Percentages sum to 100 per row.
  rows: Array<{ level: string; percent: number }>;
};

/**
 * Illustrative distribution data. Not pulled from a survey provider.
 * The teaching point is that a single title spans multiple levels.
 * Numbers are author-illustrative and clearly labeled as such.
 */
const DISTRIBUTIONS: Distribution[] = [
  {
    title: "Senior Engineer",
    blurb: "A common title that often spans P3 to P5 across companies.",
    rows: [
      { level: "P3 Proficient", percent: 25 },
      { level: "P4 Advanced", percent: 50 },
      { level: "P5 Expert", percent: 25 },
    ],
  },
  {
    title: "Senior Manager",
    blurb: "Usually maps to M3 or M4. The split depends on org size and accountability.",
    rows: [
      { level: "M3 Manager", percent: 35 },
      { level: "M4 Senior Manager", percent: 55 },
      { level: "M5 Director", percent: 10 },
    ],
  },
  {
    title: "Director",
    blurb: "The label hides a wide range. Some directors are M4, some are E1.",
    rows: [
      { level: "M4 Senior Manager", percent: 20 },
      { level: "M5 Director", percent: 50 },
      { level: "M6 Senior Director", percent: 20 },
      { level: "E1 VP", percent: 10 },
    ],
  },
  {
    title: "VP",
    blurb: "Often E1 or E2, sometimes M6 in flatter orgs that use VP as a senior manager title.",
    rows: [
      { level: "M6 Senior Director", percent: 15 },
      { level: "E1 VP", percent: 50 },
      { level: "E2 Regional VP", percent: 25 },
      { level: "E3 SVP", percent: 10 },
    ],
  },
  {
    title: "Principal",
    blurb: "Almost always P6 or P7. The IC ladder's senior end.",
    rows: [
      { level: "P5 Expert", percent: 10 },
      { level: "P6 Principal", percent: 65 },
      { level: "P7 Distinguished", percent: 25 },
    ],
  },
];

const FOOTNOTE =
  "Illustrative distribution. Real distribution varies by company, industry, and survey.";

export function TitleVsLevelInsight({ title = "Director" }: Props) {
  return (
    <WidgetFrame
      caption="Same title, different levels"
      footer={<span>{FOOTNOTE}</span>}
      fallback={<TitleFallback />}
    >
      <TitleInteractive initialTitle={title} />
    </WidgetFrame>
  );
}

function TitleInteractive({ initialTitle }: { initialTitle: SupportedTitle }) {
  const [active, setActive] = useState<SupportedTitle>(initialTitle);
  const groupId = useId();
  const dist = DISTRIBUTIONS.find((d) => d.title === active)!;

  return (
    <div>
      <fieldset>
        <legend className="text-sm font-semibold leading-6">
          Pick a title to see how its level distribution typically lands.
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {DISTRIBUTIONS.map((d) => {
            const selected = d.title === active;
            return (
              <label
                key={d.title}
                className="cursor-pointer rounded-full border px-3 py-2 text-xs font-medium focus-within:outline-2 focus-within:outline-offset-2"
                style={{
                  background: selected ? "var(--accent-soft)" : "var(--surface-alt)",
                  borderColor: selected ? "var(--accent)" : "var(--line)",
                  color: "var(--text)",
                  outlineColor: "var(--accent)",
                  minHeight: "44px",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="radio"
                  name={groupId}
                  value={d.title}
                  checked={selected}
                  onChange={() => setActive(d.title)}
                  className="sr-only"
                />
                {d.title}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div role="status" aria-live="polite" className="mt-4">
        <p className="text-sm leading-6" style={{ color: "var(--muted)" }}>
          {dist.blurb}
        </p>
        <p className="sr-only">
          {dist.title} distribution:{" "}
          {dist.rows.map((r) => `${r.level} ${r.percent}%`).join(", ")}.
        </p>
        <ul className="mt-3 space-y-2">
          {dist.rows.map((row) => (
            <li key={row.level} className="text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <span>{row.level}</span>
                <span
                  className="font-mono text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {row.percent}%
                </span>
              </div>
              <div
                aria-hidden="true"
                className="mt-1 h-2 w-full rounded-full"
                style={{ background: "var(--surface-alt)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${row.percent}%`,
                    background: "var(--accent)",
                    transition: "width 200ms ease",
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TitleFallback() {
  return (
    <div>
      <p className="text-sm leading-6">
        Across companies, titles like &ldquo;Senior Engineer&rdquo; commonly span
        P3 to P5. The exact distribution matters less than the takeaway: title
        alone does not tell you the level.
      </p>
      <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
        {DISTRIBUTIONS.map((d) => (
          <li key={d.title}>
            <span className="font-semibold" style={{ color: "var(--text)" }}>
              {d.title}.
            </span>{" "}
            {d.rows.map((r) => `${r.level} ${r.percent}%`).join(", ")}.
          </li>
        ))}
      </ul>
    </div>
  );
}
