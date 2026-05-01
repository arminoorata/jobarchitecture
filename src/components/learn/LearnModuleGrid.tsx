"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { LearnModule } from "@/data/modules";
import { learningPaths, type LearningPathId } from "@/data/learning-paths";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  modules: LearnModule[];
  pathId: LearningPathId | null;
};

/**
 * Renders the module cards in the order dictated by `pathId`. When `pathId`
 * is null, modules render in the canonical order passed in. When the order
 * changes, the grid briefly fades from 0.5 to 1 opacity to signal the
 * re-shuffle. Reduced-motion users get an instant order change with no fade.
 */
export function LearnModuleGrid({ modules, pathId }: Props) {
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
    // Fallback: append any modules that weren't in the path order (shouldn't
    // happen with the current data, but keeps the grid resilient).
    for (const m of modules) {
      if (!result.includes(m)) result.push(m);
    }
    return result;
  }, [modules, pathId]);

  // Order signature drives the CSS animation key. When the signature changes,
  // the grid remounts and replays the fade-in. Reduced-motion users skip the
  // animation entirely. No setState-in-effect cascading-render risk.
  const orderSignature = ordered.map((m) => m.id).join("|");

  return (
    <div
      key={orderSignature}
      className="grid gap-4 md:grid-cols-2"
      style={{
        animation: prefersReducedMotion
          ? "none"
          : "modulegrid-fade 200ms ease-out",
      }}
    >
      {ordered.map((module) => (
        <Link
          key={module.id}
          href={`/learn/${module.id}`}
          aria-label={module.title}
          className="block rounded-[var(--radius-card)] border p-5 transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{
            borderColor: "var(--line)",
            background: "var(--surface)",
            color: "var(--text)",
            minHeight: "44px",
          }}
        >
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="text-2xl">
              {module.icon}
            </span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold tracking-tight">
                {module.title}
              </h3>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <span>{module.audience}</span>
            <span aria-hidden="true">·</span>
            <span>{module.minutes} min read</span>
          </div>
          <p className="mt-3 text-sm leading-6" style={{ color: "var(--muted)" }}>
            {module.blurb}
          </p>
          <p
            className="mt-4 text-sm font-semibold"
            style={{ color: "var(--accent)" }}
          >
            Read this →
          </p>
        </Link>
      ))}
    </div>
  );
}

export default LearnModuleGrid;
