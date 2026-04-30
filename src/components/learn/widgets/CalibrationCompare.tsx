"use client";

import { calculateLevelingResult, type LevelingScores } from "@/lib/leveling";
import { dimensions, type RoleType } from "@/data/leveling";
import { WidgetFrame } from "./WidgetFrame";

type RoleInput = {
  label: string;
  scores: LevelingScores;
  /**
   * Optional. When omitted, the track is inferred from which dimensions are
   * present: `peopleLeadership` ⇒ manager, `strategyOwnership` ⇒ executive,
   * otherwise IC. Spec §13.6 lists `{ label, scores }` as the public shape;
   * the inference keeps the contract while still letting the engine run.
   */
  track?: RoleType;
};

type Props = {
  roleA?: RoleInput;
  roleB?: RoleInput;
};

function inferTrack(scores: LevelingScores): RoleType {
  if (scores.strategyOwnership !== undefined) return "executive";
  if (scores.peopleLeadership !== undefined) return "manager";
  return "ic";
}

const DEFAULT_ROLE_A: RoleInput = {
  label: "HRBP supporting a 90-person unit",
  scores: {
    scope: 4,
    complexity: 4,
    autonomy: 4,
    influence: 4,
    knowledge: 4,
    businessImpact: 3,
  },
};

const DEFAULT_ROLE_B: RoleInput = {
  label: "HRBP supporting a 350-person unit, cross-region",
  scores: {
    scope: 5,
    complexity: 5,
    autonomy: 5,
    influence: 5,
    knowledge: 5,
    businessImpact: 5,
  },
};

/**
 * Two roles dropped side by side, dimension by dimension. Highlights where
 * one beats the other; renders the resulting level for each.
 *
 * Inputs: `roleA` and `roleB` (each `{ label, track, scores }`). Defaults
 * to two HRBP-shaped roles so the widget renders meaningfully when modules
 * embed it without props.
 *
 * Fallback: same side-by-side table without delta highlighting.
 */
export function CalibrationCompare({
  roleA = DEFAULT_ROLE_A,
  roleB = DEFAULT_ROLE_B,
}: Props) {
  return (
    <WidgetFrame
      wide
      caption="Two roles side by side"
      fallback={<CompareTable a={roleA} b={roleB} highlight={false} />}
    >
      <CompareTable a={roleA} b={roleB} highlight />
    </WidgetFrame>
  );
}

function CompareTable({
  a,
  b,
  highlight,
}: {
  a: RoleInput;
  b: RoleInput;
  highlight: boolean;
}) {
  const trackA = a.track ?? inferTrack(a.scores);
  const trackB = b.track ?? inferTrack(b.scores);
  const resultA = calculateLevelingResult(trackA, a.scores);
  const resultB = calculateLevelingResult(trackB, b.scores);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <RoleHeader role={a} result={resultA} />
        <RoleHeader role={b} result={resultB} />
      </div>
      <div className="mt-4 overflow-x-auto">
        <table
          className="w-full min-w-[560px] border-collapse text-sm"
          style={{ color: "var(--text)" }}
        >
          <caption className="sr-only">
            Dimension-by-dimension comparison of two roles
          </caption>
          <thead>
            <tr style={{ color: "var(--text-muted)" }}>
              <th
                scope="col"
                className="border-b px-3 py-2 text-left font-medium"
                style={{ borderColor: "var(--line)" }}
              >
                Dimension
              </th>
              <th
                scope="col"
                className="border-b px-3 py-2 text-left font-medium"
                style={{ borderColor: "var(--line)" }}
              >
                Role A
              </th>
              <th
                scope="col"
                className="border-b px-3 py-2 text-left font-medium"
                style={{ borderColor: "var(--line)" }}
              >
                Role B
              </th>
              <th
                scope="col"
                className="border-b px-3 py-2 text-left font-medium"
                style={{ borderColor: "var(--line)" }}
              >
                Delta
              </th>
            </tr>
          </thead>
          <tbody>
            {dimensions
              .filter(
                (d) =>
                  d.appliesTo === "all" ||
                  (d.appliesTo === "manager" &&
                    (trackA === "manager" || trackB === "manager")) ||
                  (d.appliesTo === "executive" &&
                    (trackA === "executive" || trackB === "executive")),
              )
              .map((d) => {
                const sa = a.scores[d.id] ?? null;
                const sb = b.scores[d.id] ?? null;
                const delta =
                  sa !== null && sb !== null ? sb - sa : null;
                const deltaLabel =
                  delta === null
                    ? "·"
                    : delta > 0
                      ? `Role B higher (+${delta})`
                      : delta < 0
                        ? `Role A higher (${delta})`
                        : "Tied";
                return (
                  <tr key={d.id}>
                    <th
                      scope="row"
                      className="border-b px-3 py-2 text-left font-medium"
                      style={{
                        borderColor: "var(--line)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {d.shortLabel}
                    </th>
                    <td
                      className="border-b px-3 py-2 font-mono"
                      style={{ borderColor: "var(--line)" }}
                    >
                      {sa ?? "·"}
                    </td>
                    <td
                      className="border-b px-3 py-2 font-mono"
                      style={{ borderColor: "var(--line)" }}
                    >
                      {sb ?? "·"}
                    </td>
                    <td
                      className="border-b px-3 py-2 text-xs"
                      style={{
                        borderColor: "var(--line)",
                        color: highlight && delta !== null && delta !== 0
                          ? "var(--accent)"
                          : "var(--text-muted)",
                      }}
                    >
                      {deltaLabel}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoleHeader({
  role,
  result,
}: {
  role: RoleInput;
  result: ReturnType<typeof calculateLevelingResult>;
}) {
  return (
    <div
      className="rounded-[var(--radius-card)] border p-3"
      style={{
        background: "var(--surface-alt)",
        borderColor: "var(--line)",
      }}
    >
      <p className="text-sm font-semibold">{role.label}</p>
      <p className="mt-2">
        <span className="font-mono text-lg" style={{ color: "var(--accent)" }}>
          {result.levelCode}
        </span>{" "}
        <span className="text-sm">{result.levelName}</span>
      </p>
      <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
        {result.confidence} confidence
        {result.boundary ? `, boundary ${result.boundary}` : ""}.
      </p>
      {result.flags.length > 0 ? (
        <ul
          className="mt-2 space-y-1 text-xs leading-5"
          style={{ color: "var(--text)" }}
        >
          {result.flags.map((flag, i) => (
            <li key={i} className="flex gap-2">
              <span
                aria-hidden="true"
                className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              <span>{flag}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
