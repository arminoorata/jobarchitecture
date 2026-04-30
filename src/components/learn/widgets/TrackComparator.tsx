"use client";

import { useId, useState } from "react";
import { calculateLevelingResult } from "@/lib/leveling";
import { dimensions, type DimensionId } from "@/data/leveling";
import { WidgetFrame } from "./WidgetFrame";

type Mode = "score-pattern" | "role-shape";

type Props = {
  /**
   * Which comparison view to render. Defaults to `score-pattern`.
   *
   * - `score-pattern` is the interactive picker used in Module 8.2 (How
   *   Leveling Works). The user picks a pattern, the engine runs, the
   *   resulting IC level shows alongside a brief read of the pattern.
   * - `role-shape` is the side-by-side view used in Module 8.3 (Tracks).
   *   Three sample roles render with their profiles, no interaction.
   */
  mode?: Mode;
};

type ScorePattern = {
  id: "low-scope-high-complexity" | "balanced" | "high-scope-low-complexity";
  title: string;
  blurb: string;
  scores: Record<DimensionId, number>;
};

const SCORE_PATTERNS: ScorePattern[] = [
  {
    id: "low-scope-high-complexity",
    title: "Narrow scope, deep problems",
    blurb:
      "Owns a small area but the problems inside it are genuinely hard.",
    scores: {
      scope: 3,
      complexity: 6,
      autonomy: 5,
      influence: 3,
      knowledge: 6,
      businessImpact: 3,
      peopleLeadership: 1,
      strategyOwnership: 1,
    },
  },
  {
    id: "balanced",
    title: "Balanced senior",
    blurb:
      "All six dimensions sit in the same neighborhood. The pattern that maps cleanest to a level.",
    scores: {
      scope: 5,
      complexity: 5,
      autonomy: 5,
      influence: 5,
      knowledge: 5,
      businessImpact: 5,
      peopleLeadership: 1,
      strategyOwnership: 1,
    },
  },
  {
    id: "high-scope-low-complexity",
    title: "Wide reach, simpler work",
    blurb:
      "Owns a big surface area, but the work inside it is mostly known plays.",
    scores: {
      scope: 6,
      complexity: 3,
      autonomy: 5,
      influence: 6,
      knowledge: 4,
      businessImpact: 6,
      peopleLeadership: 1,
      strategyOwnership: 1,
    },
  },
];

type RoleShape = {
  id: "senior-engineer" | "senior-manager" | "vp";
  title: string;
  track: "ic" | "manager" | "executive";
  scores: Record<DimensionId, number>;
};

const ROLE_SHAPES: RoleShape[] = [
  {
    id: "senior-engineer",
    title: "Senior Engineer",
    track: "ic",
    scores: {
      scope: 5,
      complexity: 5,
      autonomy: 5,
      influence: 5,
      knowledge: 5,
      businessImpact: 5,
      peopleLeadership: 1,
      strategyOwnership: 1,
    },
  },
  {
    id: "senior-manager",
    title: "Senior Manager",
    track: "manager",
    scores: {
      scope: 4,
      complexity: 4,
      autonomy: 4,
      influence: 4,
      knowledge: 4,
      businessImpact: 4,
      peopleLeadership: 5,
      strategyOwnership: 1,
    },
  },
  {
    id: "vp",
    title: "Regional VP",
    track: "executive",
    scores: {
      scope: 6,
      complexity: 6,
      autonomy: 6,
      influence: 6,
      knowledge: 5,
      businessImpact: 6,
      peopleLeadership: 1,
      strategyOwnership: 5,
    },
  },
];

export function TrackComparator({ mode = "score-pattern" }: Props) {
  if (mode === "role-shape") {
    return (
      <WidgetFrame
        wide
        caption="Three roles, three shapes"
        fallback={<RoleShapeView />}
      >
        <RoleShapeView />
      </WidgetFrame>
    );
  }
  return (
    <WidgetFrame
      caption="Pick a pattern, see the level"
      fallback={<ScorePatternFallback />}
    >
      <ScorePatternView />
    </WidgetFrame>
  );
}

function ScorePatternView() {
  const [selectedId, setSelectedId] = useState<ScorePattern["id"]>("balanced");
  const groupId = useId();
  const selected = SCORE_PATTERNS.find((p) => p.id === selectedId)!;
  const result = calculateLevelingResult("ic", selected.scores);

  return (
    <fieldset>
      <legend className="text-sm font-semibold leading-6">
        Three score patterns. Same six dimensions, different shapes.
      </legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {SCORE_PATTERNS.map((pattern) => {
          const active = pattern.id === selectedId;
          return (
            <label
              key={pattern.id}
              className="flex cursor-pointer flex-col gap-2 rounded-[var(--radius-card)] border p-3 focus-within:outline-2 focus-within:outline-offset-2"
              style={{
                background: active ? "var(--accent-soft)" : "var(--surface-alt)",
                borderColor: active ? "var(--accent)" : "var(--line)",
                color: "var(--text)",
                outlineColor: "var(--accent)",
                transition: "background 160ms ease, border-color 160ms ease",
                minHeight: "44px",
              }}
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name={groupId}
                  value={pattern.id}
                  checked={active}
                  onChange={() => setSelectedId(pattern.id)}
                  className="h-4 w-4"
                  style={{ accentColor: "var(--accent)" }}
                />
                <span className="text-sm font-semibold">{pattern.title}</span>
              </span>
              <span
                className="text-xs leading-5"
                style={{ color: "var(--muted)" }}
              >
                {pattern.blurb}
              </span>
            </label>
          );
        })}
      </div>
      <div
        role="status"
        aria-live="polite"
        className="mt-4 rounded-[var(--radius-card)] border p-4"
        style={{
          background: "var(--surface-alt)",
          borderColor: "var(--line)",
        }}
      >
        <p className="text-xs uppercase tracking-[0.24em]" style={{ color: "var(--text-muted)" }}>
          Result
        </p>
        <p className="mt-1 text-2xl font-semibold">
          <span className="font-mono" style={{ color: "var(--accent)" }}>
            {result.levelCode}
          </span>{" "}
          <span>{result.levelName}</span>
        </p>
        <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
          {result.explanation}
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4" style={{ color: "var(--text-muted)" }}>
          <div>
            <dt>Weighted score</dt>
            <dd className="font-mono" style={{ color: "var(--text)" }}>
              {result.weightedScore.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt>Confidence</dt>
            <dd style={{ color: "var(--text)" }}>{result.confidence}</dd>
          </div>
          <div>
            <dt>Boundary</dt>
            <dd style={{ color: "var(--text)" }}>{result.boundary ?? "None"}</dd>
          </div>
          <div>
            <dt>Flags</dt>
            <dd style={{ color: "var(--text)" }}>{result.flags.length}</dd>
          </div>
        </dl>
      </div>
    </fieldset>
  );
}

function ScorePatternFallback() {
  const computed = SCORE_PATTERNS.map((pattern) => ({
    pattern,
    result: calculateLevelingResult("ic", pattern.scores),
  }));
  return (
    <div className="overflow-x-auto">
      <table
        className="w-full min-w-[560px] border-collapse text-sm"
        style={{ color: "var(--text)" }}
      >
        <caption
          className="caption-top pb-3 text-left text-sm leading-6"
          style={{ color: "var(--muted)" }}
        >
          Three sample IC score patterns and where the engine lands each one.
        </caption>
        <thead>
          <tr style={{ color: "var(--text-muted)" }}>
            <th
              scope="col"
              className="border-b px-3 py-2 text-left font-medium"
              style={{ borderColor: "var(--line)" }}
            >
              Pattern
            </th>
            <th
              scope="col"
              className="border-b px-3 py-2 text-left font-medium"
              style={{ borderColor: "var(--line)" }}
            >
              Shape
            </th>
            <th
              scope="col"
              className="border-b px-3 py-2 text-left font-medium"
              style={{ borderColor: "var(--line)" }}
            >
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          {computed.map(({ pattern, result }) => (
            <tr key={pattern.id}>
              <th
                scope="row"
                className="border-b px-3 py-2 text-left font-medium"
                style={{
                  borderColor: "var(--line)",
                  color: "var(--text)",
                }}
              >
                {pattern.title}
              </th>
              <td
                className="border-b px-3 py-2"
                style={{ borderColor: "var(--line)", color: "var(--muted)" }}
              >
                {pattern.blurb}
              </td>
              <td
                className="border-b px-3 py-2"
                style={{ borderColor: "var(--line)" }}
              >
                <span className="font-mono" style={{ color: "var(--accent)" }}>
                  {result.levelCode}
                </span>{" "}
                {result.levelName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RoleShapeView() {
  return (
    <div>
      <p className="text-sm leading-6">
        Three roles seated at similar seniority bands. What changes between them
        is what makes the role bigger.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table
          className="w-full min-w-[640px] border-collapse text-sm"
          style={{ color: "var(--text)" }}
        >
          <caption className="sr-only">Three role shapes side by side</caption>
          <thead>
            <tr style={{ color: "var(--text-muted)" }}>
              <th
                scope="col"
                className="border-b px-3 py-2 text-left font-medium"
                style={{ borderColor: "var(--line)" }}
              >
                Dimension
              </th>
              {ROLE_SHAPES.map((role) => {
                const result = calculateLevelingResult(role.track, role.scores);
                return (
                  <th
                    key={role.id}
                    scope="col"
                    className="border-b px-3 py-2 text-left font-medium"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <span className="block text-sm" style={{ color: "var(--text)" }}>
                      {role.title}
                    </span>
                    <span
                      className="block font-mono text-xs"
                      style={{ color: "var(--accent)" }}
                    >
                      {result.levelCode} {result.levelName}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {dimensions.map((d) => (
              <tr key={d.id}>
                <th
                  scope="row"
                  className="border-b px-3 py-2 text-left font-medium"
                  style={{ borderColor: "var(--line)", color: "var(--text-muted)" }}
                >
                  {d.shortLabel}
                </th>
                {ROLE_SHAPES.map((role) => {
                  const score = role.scores[d.id];
                  const applies =
                    d.appliesTo === "all" ||
                    (d.appliesTo === "manager" && role.track === "manager") ||
                    (d.appliesTo === "executive" && role.track === "executive");
                  return (
                    <td
                      key={role.id}
                      className="border-b px-3 py-2"
                      style={{ borderColor: "var(--line)" }}
                    >
                      {applies ? (
                        <span className="font-mono">{score}</span>
                      ) : (
                        <span aria-label="not applicable" style={{ color: "var(--text-muted)" }}>·</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p
        className="mt-3 text-xs leading-5"
        style={{ color: "var(--text-muted)" }}
      >
        Same engine, three tracks, three different weightings.
      </p>
    </div>
  );
}
