"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo } from "react";
import type { LearnModule } from "@/data/modules";
import { learningPaths, type LearningPathId } from "@/data/learning-paths";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  modules: LearnModule[];
  pathId: LearningPathId | null;
  /**
   * Module id that should render in the larger "Start here" treatment.
   * When null, no tile is featured and all five render at the standard
   * size. The Learn home page passes the first id in the selected path's
   * `moduleOrder`, falling back to `architecture` when no path is selected.
   */
  featuredId?: string | null;
};

/**
 * Renders the module cards in the order dictated by `pathId`. When `pathId`
 * is null, modules render in the canonical order passed in. When the order
 * changes, the grid briefly fades from 0.5 to 1 opacity to signal the
 * re-shuffle. Reduced-motion users get an instant order change with no fade.
 *
 * The featured tile spans two columns and gets a "Start here" badge plus a
 * tone-tinted gradient. The other four render in a uniform two-column grid
 * with thin tone accents on the left edge for visual rhythm.
 */
export function LearnModuleGrid({ modules, pathId, featuredId = null }: Props) {
  const prefersReducedMotion = useReducedMotion();

  const ordered = useMemo(() => {
    if (!pathId) return modules;
    const path = learningPaths.find((p) => p.id === pathId);
    if (!path) return modules;
    const byId = new Map(modules.map((m) => [m.id, m]));
    const result: LearnModule[] = [];
    for (const id of path.moduleOrder) {
      const found = byId.get(id);
      if (found) result.push(found);
    }
    for (const m of modules) {
      if (!result.includes(m)) result.push(m);
    }
    return result;
  }, [modules, pathId]);

  const orderSignature = ordered.map((m) => m.id).join("|");

  return (
    <ul
      key={orderSignature}
      className="grid gap-4 md:grid-cols-2"
      style={{
        animation: prefersReducedMotion
          ? "none"
          : "modulegrid-fade 200ms ease-out",
      }}
    >
      {ordered.map((module) => {
        const tone = toneFor(module.id);
        const featured = featuredId === module.id;
        const titleId = `module-${module.id}-title`;
        return (
          <li
            key={module.id}
            className={featured ? "md:col-span-2" : undefined}
          >
            <Link
              href={`/learn/${module.id}`}
              aria-labelledby={titleId}
              className="group spotlight-card relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border p-5 outline-none transition-[color,border-color,background-color,transform] motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: featured ? tone.border : "var(--line)",
                background: featured
                  ? `linear-gradient(135deg, ${tone.bg}, var(--surface) 52%, var(--surface-alt))`
                  : "linear-gradient(180deg, var(--surface-alt), var(--surface))",
                color: "var(--text)",
                outlineColor: "var(--accent)",
                minHeight: featured ? 220 : 188,
              }}
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-full w-1"
                style={{ background: tone.color }}
              />
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="text-2xl leading-none"
                    style={{ filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.3))" }}
                  >
                    {module.icon}
                  </span>
                  {featured && (
                    <span
                      className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]"
                      style={{
                        borderColor: tone.border,
                        background: tone.bg,
                        color: tone.color,
                      }}
                    >
                      Start here
                    </span>
                  )}
                </div>
                <span
                  className="text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span className="font-mono">{module.minutes}</span> min
                </span>
              </div>

              <div className="mt-5 flex flex-1 items-center" aria-hidden="true">
                <Preview id={module.id} tone={tone} featured={featured} />
              </div>

              <h3
                id={titleId}
                className={`${featured ? "text-[22px] md:text-2xl" : "text-[18px]"} mt-5 max-w-[20rem] font-semibold leading-snug tracking-tight`}
                style={{ color: "var(--text)" }}
              >
                {module.cardTitle ?? module.title}
              </h3>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span
                  className="text-[11px] uppercase tracking-[0.18em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {module.audience}
                </span>
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] group-focus-visible:border-[var(--accent)] group-focus-visible:text-[var(--accent)]"
                  style={{
                    borderColor: "var(--line)",
                    color: "var(--text-muted)",
                    background: "var(--surface)",
                  }}
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default LearnModuleGrid;

type Tone = {
  color: string;
  border: string;
  bg: string;
};

function toneFor(id: string): Tone {
  switch (id) {
    case "leveling":
      return {
        color: "var(--green)",
        border: "var(--green-border)",
        bg: "var(--green-bg)",
      };
    case "calibration":
    case "pay-transparency":
      return {
        color: "var(--amber)",
        border: "var(--amber-border)",
        bg: "var(--amber-bg)",
      };
    case "architecture":
    case "tracks":
    default:
      return {
        color: "var(--accent)",
        border: "var(--accent-soft)",
        bg: "var(--accent-soft)",
      };
  }
}

function Preview({
  id,
  tone,
  featured,
}: {
  id: string;
  tone: Tone;
  featured: boolean;
}): ReactNode {
  switch (id) {
    case "architecture":
      return (
        <PreviewFrame tone={tone} featured={featured}>
          <ul className="space-y-1.5">
            {[
              ["Function", 78],
              ["Family", 64],
              ["Track", 52],
              ["Level", 70],
              ["Title", 58],
              ["Match", 46],
            ].map(([label, width]) => (
              <li key={label} className="flex items-center gap-2">
                <span
                  className="text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: "var(--text-muted)", width: 56 }}
                >
                  {label}
                </span>
                <span
                  className="h-1.5 rounded-full"
                  style={{
                    width: width as number,
                    background: tone.color,
                    opacity: 0.65,
                  }}
                />
              </li>
            ))}
          </ul>
        </PreviewFrame>
      );
    case "leveling":
      return (
        <PreviewFrame tone={tone} featured={featured}>
          <div className="flex items-end gap-1.5" style={{ height: 64 }}>
            {[42, 28, 56, 38, 50, 32, 46, 24].map((h, i) => (
              <span
                key={i}
                className="rounded-sm"
                style={{
                  height: h,
                  width: 10,
                  background: tone.color,
                  opacity: 0.55 + (h / 100) * 0.4,
                }}
              />
            ))}
          </div>
          <p
            className="mt-3 font-mono text-[10px]"
            style={{ color: "var(--text-muted)" }}
          >
            6 dimensions · weighted score
          </p>
        </PreviewFrame>
      );
    case "tracks":
      return (
        <PreviewFrame tone={tone} featured={featured}>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "IC", levels: 7 },
              { label: "Mgr", levels: 5 },
              { label: "Exec", levels: 5 },
            ].map((track) => (
              <div key={track.label} className="flex flex-col items-center gap-1">
                <div className="flex flex-col-reverse gap-0.5">
                  {Array.from({ length: track.levels }).map((_, i) => (
                    <span
                      key={i}
                      className="rounded-sm"
                      style={{
                        height: 6,
                        width: 28 - i * 2,
                        background: tone.color,
                        opacity: 0.4 + i * 0.08,
                      }}
                    />
                  ))}
                </div>
                <span
                  className="font-mono text-[10px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {track.label}
                </span>
              </div>
            ))}
          </div>
        </PreviewFrame>
      );
    case "calibration":
      return (
        <PreviewFrame tone={tone} featured={featured}>
          <div className="flex items-center gap-3">
            <MiniChip label="Pre-meeting" value="P4?" tone={tone} />
            <span
              aria-hidden="true"
              style={{
                color: "var(--text-muted)",
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              ↔
            </span>
            <MiniChip label="After evidence" value="P5" tone={tone} solid />
          </div>
          <p
            className="mt-3 font-mono text-[10px]"
            style={{ color: "var(--text-muted)" }}
          >
            Predict, then compare
          </p>
        </PreviewFrame>
      );
    case "pay-transparency":
      return (
        <PreviewFrame tone={tone} featured={featured}>
          <div className="w-full">
            <div className="flex items-end justify-between text-[10px] font-mono"
              style={{ color: "var(--text-muted)" }}
            >
              <span>Min</span>
              <span>Mid</span>
              <span>Max</span>
            </div>
            <div className="relative mt-2 h-2 rounded-full" style={{ background: "var(--line)" }}>
              <span
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: "72%", background: tone.color, opacity: 0.7 }}
              />
              <span
                className="absolute -top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2"
                style={{
                  left: "48%",
                  borderColor: tone.color,
                  background: "var(--surface)",
                }}
              />
            </div>
            <p
              className="mt-3 font-mono text-[10px]"
              style={{ color: "var(--text-muted)" }}
            >
              Range · target · post-ready
            </p>
          </div>
        </PreviewFrame>
      );
    default:
      return null;
  }
}

function PreviewFrame({
  tone,
  featured,
  children,
}: {
  tone: Tone;
  featured: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className="w-full rounded-[var(--radius-card)] border px-4 py-3"
      style={{
        borderColor: tone.border,
        background: featured ? "var(--surface)" : "var(--surface-alt)",
      }}
    >
      {children}
    </div>
  );
}

function MiniChip({
  label,
  value,
  tone,
  solid = false,
}: {
  label: string;
  value: string;
  tone: Tone;
  solid?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="rounded-md border px-2 py-1 font-mono text-xs font-semibold"
        style={{
          borderColor: tone.border,
          background: solid ? tone.bg : "var(--surface)",
          color: solid ? tone.color : "var(--text-muted)",
        }}
      >
        {value}
      </span>
      <span
        className="text-[10px] uppercase tracking-[0.14em]"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </span>
    </div>
  );
}
