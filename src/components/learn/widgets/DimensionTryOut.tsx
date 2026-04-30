"use client";

import { useId, useState } from "react";
import { dimensions, type DimensionId } from "@/data/leveling";
import { WidgetFrame } from "./WidgetFrame";

type Props = {
  /** Which dimension to render. Defaults to scope per spec §13.3. */
  dimensionId?: DimensionId;
};

/**
 * Picker chips for a single dimension's seven score options.
 *
 * Inputs: `dimensionId` (defaults to "scope"). Pulls the dimension's prompt,
 * options, and label from `dimensions` in `src/data/leveling.ts`.
 * Outputs: a chip row plus a result region that shows the selected option's
 * label, description, and a one-sentence "what this typically looks like"
 * example.
 *
 * Fallback: a static list of all seven options with descriptions, no
 * selected state, no animation.
 *
 * Note on examples: full per-level examples are authored for scope,
 * complexity, and autonomy. Influence, knowledge, businessImpact,
 * peopleLeadership, and strategyOwnership use a single "pick another
 * dimension" fallback line per spec §18.3 (defer until first user feedback).
 */
export function DimensionTryOut({ dimensionId = "scope" }: Props) {
  const dimension = dimensions.find((d) => d.id === dimensionId);

  if (!dimension) {
    return (
      <WidgetFrame
        fallback={
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Unknown dimension: {dimensionId}.
          </p>
        }
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Unknown dimension: {dimensionId}.
        </p>
      </WidgetFrame>
    );
  }

  return (
    <WidgetFrame
      caption={`Try one dimension · ${dimension.shortLabel}`}
      fallback={<TryOutFallback dimensionId={dimensionId} />}
      footer={
        <span>
          The wizard scores all six dimensions and combines them into a
          weighted score. This widget shows just one slice.
        </span>
      }
    >
      <TryOutInteractive dimensionId={dimensionId} />
    </WidgetFrame>
  );
}

function TryOutInteractive({ dimensionId }: { dimensionId: DimensionId }) {
  const dimension = dimensions.find((d) => d.id === dimensionId)!;
  const [picked, setPicked] = useState<number | null>(null);
  const groupId = useId();
  const liveId = `${groupId}-live`;

  const pickedOption = picked
    ? dimension.options.find((o) => o.score === picked)
    : null;

  return (
    <fieldset>
      <legend className="text-sm font-semibold leading-6">
        {dimension.prompt}
      </legend>
      <p
        className="mt-1 text-xs leading-5"
        style={{ color: "var(--text-muted)" }}
      >
        Pick the score that fits the role best. Re-pick to update.
      </p>
      <div className="mt-3 flex flex-wrap gap-2" role="radiogroup">
        {dimension.options.map((option) => {
          const selected = picked === option.score;
          return (
            <label
              key={option.score}
              className="cursor-pointer rounded-[var(--radius-pill)] border px-3 py-2 text-sm focus-within:outline-2 focus-within:outline-offset-2"
              style={{
                background: selected ? "var(--accent-soft)" : "var(--surface-alt)",
                borderColor: selected ? "var(--accent)" : "var(--line)",
                color: "var(--text)",
                outlineColor: "var(--accent)",
                minHeight: "44px",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <input
                type="radio"
                name={groupId}
                value={option.score}
                checked={selected}
                onChange={() => setPicked(option.score)}
                className="h-4 w-4"
                style={{ accentColor: "var(--accent)" }}
              />
              <span
                className="font-mono text-xs"
                style={{ color: "var(--accent)" }}
              >
                {option.score}
              </span>
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>

      <div
        id={liveId}
        role="status"
        aria-live="polite"
        className="mt-4 rounded-[var(--radius-card)] border px-4 py-3"
        style={{
          background: "var(--surface-alt)",
          borderColor: "var(--line)",
          color: "var(--text)",
          minHeight: "84px",
        }}
      >
        {pickedOption ? (
          <>
            <p className="text-sm font-semibold leading-6">
              <span
                className="mr-2 font-mono text-xs"
                style={{ color: "var(--accent)" }}
              >
                Score {pickedOption.score}
              </span>
              {pickedOption.label}
            </p>
            <p
              className="mt-1 text-sm leading-6"
              style={{ color: "var(--text)" }}
            >
              {pickedOption.description}
            </p>
            <p
              className="mt-2 text-sm italic leading-6"
              style={{ color: "var(--muted)" }}
            >
              {exampleFor(dimensionId, pickedOption.score)}
            </p>
          </>
        ) : (
          <p
            className="text-sm leading-6"
            style={{ color: "var(--text-muted)" }}
          >
            Pick a score above to see what that level typically looks like in a
            real role.
          </p>
        )}
      </div>
    </fieldset>
  );
}

function TryOutFallback({ dimensionId }: { dimensionId: DimensionId }) {
  const dimension = dimensions.find((d) => d.id === dimensionId)!;
  return (
    <fieldset>
      <legend className="text-sm font-semibold leading-6">
        {dimension.prompt}
      </legend>
      <ol className="mt-3 space-y-2">
        {dimension.options.map((option) => (
          <li
            key={option.score}
            className="rounded-[var(--radius-card)] border px-3 py-2"
            style={{
              background: "var(--surface-alt)",
              borderColor: "var(--line)",
              color: "var(--text)",
            }}
          >
            <p className="text-sm">
              <span
                className="mr-2 font-mono text-xs"
                style={{ color: "var(--accent)" }}
              >
                {option.score}
              </span>
              <span className="font-semibold">{option.label}</span>
            </p>
            <p
              className="mt-1 text-sm leading-6"
              style={{ color: "var(--muted)" }}
            >
              {option.description}
            </p>
          </li>
        ))}
      </ol>
    </fieldset>
  );
}

const SCOPE_EXAMPLES: Record<number, string> = {
  1: "This is the early-career analyst working through a defined task list each week, checking in often.",
  2: "This is the coordinator who keeps a small intake queue moving and flags anything off-pattern.",
  3: "This is the project lead who runs a multi-month rollout end to end, from scope to handoff.",
  4: "This is the role accountable when the onboarding flow's conversion drops, even if no one tells them to look.",
  5: "This is the domain owner whose calendar shapes how the function plans its next two quarters.",
  6: "This is the leader whose decisions land in three regions at once, and whose tradeoffs the regions accept.",
  7: "This is the role whose call on a build-vs-buy bet shows up in the company's annual report.",
};

const COMPLEXITY_EXAMPLES: Record<number, string> = {
  1: "This is following the documented runbook step by step, escalating anything that doesn't fit.",
  2: "This is the workflow with a known shape and three branches, all spelled out in the playbook.",
  3: "This is reusing a familiar approach in a new context, adjusting for one or two variables.",
  4: "This is the role figuring out why churn climbed last quarter when the surface signals all looked steady.",
  5: "This is balancing legal, finance, and product priorities on a single decision with no clean answer.",
  6: "This is designing the new approach because the existing playbook stopped working two years ago.",
  7: "This is the company-shaping call where the precedent doesn't exist and the wrong answer is expensive.",
};

const AUTONOMY_EXAMPLES: Record<number, string> = {
  1: "The manager sets the daily list, walks through the method, and reviews the output.",
  2: "The work is owned but the approach gets sanity-checked before each major step.",
  3: "Familiar work runs solo. New or sensitive work gets a quick alignment first.",
  4: "Goals come from above. The role decides how to hit them and aligns periodically.",
  5: "Broad direction lands in the inbox. The role figures out priorities and tradeoffs.",
  6: "The role sets the operating plan others run against, with leadership weighing in on shape, not detail.",
  7: "Few precedents, fewer guardrails. The role calls the direction and owns the consequences.",
};

const PER_DIMENSION_EXAMPLES: Partial<Record<DimensionId, Record<number, string>>> = {
  scope: SCOPE_EXAMPLES,
  complexity: COMPLEXITY_EXAMPLES,
  autonomy: AUTONOMY_EXAMPLES,
};

function exampleFor(dimensionId: DimensionId, score: number): string {
  const table = PER_DIMENSION_EXAMPLES[dimensionId];
  if (table && table[score]) return table[score];
  // Influence, knowledge, businessImpact, peopleLeadership, strategyOwnership
  // share a single fallback line per spec §18.3.
  return "Pick another dimension to see a worked example for this score.";
}
