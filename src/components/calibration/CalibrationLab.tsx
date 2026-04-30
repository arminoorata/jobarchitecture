"use client";

import { useReducer, useState } from "react";
import { scenarios, type Scenario } from "@/data/scenarios";
import { levelNames } from "@/data/leveling";

type PerScenarioState = {
  predictedBand: string | null;
  reason: string;
  revealed: boolean;
};

type State = {
  activeScenarioId: string;
  perScenario: Record<string, PerScenarioState>;
};

type Action =
  | { type: "SELECT_SCENARIO"; id: string }
  | { type: "SET_BAND"; id: string; band: string }
  | { type: "SET_REASON"; id: string; reason: string }
  | { type: "REVEAL"; id: string }
  | { type: "BACK_TO_PREDICT"; id: string }
  | { type: "ADVANCE_TO_NEXT" }
  | { type: "RESET_SESSION" };

function emptyPerScenario(): Record<string, PerScenarioState> {
  return scenarios.reduce<Record<string, PerScenarioState>>((acc, scenario) => {
    acc[scenario.id] = { predictedBand: null, reason: "", revealed: false };
    return acc;
  }, {});
}

const initialState: State = {
  activeScenarioId: scenarios[0].id,
  perScenario: emptyPerScenario(),
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SELECT_SCENARIO":
      return { ...state, activeScenarioId: action.id };
    case "SET_BAND":
      return {
        ...state,
        perScenario: {
          ...state.perScenario,
          [action.id]: {
            ...state.perScenario[action.id],
            predictedBand: action.band,
          },
        },
      };
    case "SET_REASON":
      return {
        ...state,
        perScenario: {
          ...state.perScenario,
          [action.id]: {
            ...state.perScenario[action.id],
            reason: action.reason.slice(0, 120),
          },
        },
      };
    case "REVEAL":
      return {
        ...state,
        perScenario: {
          ...state.perScenario,
          [action.id]: {
            ...state.perScenario[action.id],
            revealed: true,
          },
        },
      };
    case "BACK_TO_PREDICT":
      return {
        ...state,
        perScenario: {
          ...state.perScenario,
          [action.id]: { predictedBand: null, reason: "", revealed: false },
        },
      };
    case "ADVANCE_TO_NEXT": {
      const activeIdx = scenarios.findIndex(
        (s) => s.id === state.activeScenarioId,
      );
      const ordered = [
        ...scenarios.slice(activeIdx + 1),
        ...scenarios.slice(0, activeIdx + 1),
      ];
      const nextUnrevealed = ordered.find(
        (s) => !state.perScenario[s.id]?.revealed,
      );
      if (!nextUnrevealed) return state;
      return { ...state, activeScenarioId: nextUnrevealed.id };
    }
    case "RESET_SESSION":
      return {
        activeScenarioId: scenarios[0].id,
        perScenario: emptyPerScenario(),
      };
    default:
      return state;
  }
}

const trackBands: Record<Scenario["track"], string[]> = {
  IC: ["P1", "P2", "P3", "P4", "P5", "P6", "P7"],
  Manager: ["M2", "M3", "M4", "M5", "M6"],
  Executive: ["E1", "E2", "E3", "E4", "E5"],
};

const SUFFIX_BANDS = ["On a boundary", "Not enough info."] as const;

const PREDICT_INTRO_HEAD = "What level would you give this role?";
const PREDICT_INTRO_BODY =
  "Read the facts. Pick the band you'd argue for in a calibration session, then see how your reasoning lines up with the recommended answer. There's no scoring. You're building the muscle.";

const REFLECT_PROMPT =
  "What single piece of evidence in this scenario would change the band? Hold that up against the role you actually had in mind when you read this.";

export default function CalibrationLab() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const active =
    scenarios.find((s) => s.id === state.activeScenarioId) ?? scenarios[0];
  const activeStateRow = state.perScenario[active.id];
  const predictedCount = Object.values(state.perScenario).filter(
    (row) => row.predictedBand !== null,
  ).length;
  const revealedCount = Object.values(state.perScenario).filter(
    (row) => row.revealed,
  ).length;
  const allRevealed = revealedCount === scenarios.length;

  const sessionStats = (
    <div
      className="rounded-[8px] border px-4 py-3 text-sm"
      style={{
        borderColor: "var(--line)",
        background: "var(--surface)",
        color: "var(--text-secondary)",
      }}
      aria-live="polite"
    >
      <span className="mono">
        Predicted: {predictedCount} of {scenarios.length}
      </span>
      <span aria-hidden="true"> · </span>
      <button
        type="button"
        onClick={() => dispatch({ type: "RESET_SESSION" })}
        className="underline-offset-2 hover:underline focus-visible:underline"
        style={{ color: "var(--accent)" }}
      >
        Reset session
      </button>
    </div>
  );

  return (
    <section aria-labelledby="calibration-title" className="relative">
      <header className="md:pr-72">
        <p
          className="text-xs font-medium uppercase tracking-[0.32em]"
          style={{ color: "var(--accent)" }}
        >
          Calibration lab
        </p>
        <h1
          id="calibration-title"
          className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
        >
          Practice calibration on real boundary cases.
        </h1>
        <p
          className="mt-5 max-w-3xl leading-7"
          style={{ color: "var(--muted)" }}
        >
          Each one is a role I&rsquo;ve actually leveled. Read the facts, pick
          a band, then compare your reasoning against the recommended answer.
          The watch-outs are where most calibration sessions land in practice.
        </p>
      </header>

      <ScenarioStrip
        activeId={state.activeScenarioId}
        perScenario={state.perScenario}
        onSelect={(id) => dispatch({ type: "SELECT_SCENARIO", id })}
      />

      <div className="mt-4 flex justify-end md:absolute md:right-0 md:top-0 md:mt-0">
        {sessionStats}
      </div>

      <ScenarioPanel
        scenario={active}
        row={activeStateRow}
        onPickBand={(band) =>
          dispatch({ type: "SET_BAND", id: active.id, band })
        }
        onChangeReason={(reason) =>
          dispatch({ type: "SET_REASON", id: active.id, reason })
        }
        onReveal={() => dispatch({ type: "REVEAL", id: active.id })}
        onBackToPredict={() =>
          dispatch({ type: "BACK_TO_PREDICT", id: active.id })
        }
        onNext={() =>
          allRevealed
            ? dispatch({ type: "RESET_SESSION" })
            : dispatch({ type: "ADVANCE_TO_NEXT" })
        }
        allRevealed={allRevealed}
      />
    </section>
  );
}

function ScenarioStrip({
  activeId,
  perScenario,
  onSelect,
}: {
  activeId: string;
  perScenario: Record<string, PerScenarioState>;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Scenario picker"
      className="mt-8 -mx-6 overflow-x-auto px-6 md:mx-0 md:px-0"
      style={{ scrollSnapType: "x mandatory" }}
    >
      <div className="flex gap-3 md:grid md:grid-cols-4 md:gap-3">
        {scenarios.map((scenario) => {
          const selected = scenario.id === activeId;
          const revealed = perScenario[scenario.id]?.revealed ?? false;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => onSelect(scenario.id)}
              aria-pressed={selected}
              className="min-w-[240px] flex-shrink-0 rounded-[8px] border p-4 text-left transition-colors md:min-w-0"
              style={{
                borderColor: selected ? "var(--accent)" : "var(--line)",
                background: selected
                  ? "var(--accent-soft)"
                  : "var(--surface)",
                scrollSnapAlign: "start",
              }}
            >
              <span
                className="text-xs font-medium uppercase tracking-[0.22em]"
                style={{
                  color: selected ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                {scenario.track} · {scenario.family}
              </span>
              <span
                className="mt-2 block font-semibold leading-snug"
                style={{
                  color: selected ? "var(--text)" : "var(--text-secondary)",
                }}
              >
                {scenario.title}
              </span>
              <span
                className="mono mt-3 block text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                {revealed ? "Revealed" : "Predict"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ScenarioPanel({
  scenario,
  row,
  onPickBand,
  onChangeReason,
  onReveal,
  onBackToPredict,
  onNext,
  allRevealed,
}: {
  scenario: Scenario;
  row: PerScenarioState;
  onPickBand: (band: string) => void;
  onChangeReason: (reason: string) => void;
  onReveal: () => void;
  onBackToPredict: () => void;
  onNext: () => void;
  allRevealed: boolean;
}) {
  return (
    <article
      className="mt-6 rounded-[var(--radius-card)] border p-6 md:p-8"
      style={{ borderColor: "var(--line)", background: "var(--surface)" }}
    >
      <div className="flex flex-col gap-2">
        <p
          className="text-xs font-medium uppercase tracking-[0.24em]"
          style={{ color: "var(--accent)" }}
        >
          {scenario.track} · {scenario.family}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {scenario.title}
        </h2>
      </div>

      {row.revealed ? (
        <RevealStep
          scenario={scenario}
          row={row}
          onBackToPredict={onBackToPredict}
          onNext={onNext}
          allRevealed={allRevealed}
        />
      ) : (
        <PredictStep
          scenario={scenario}
          row={row}
          onPickBand={onPickBand}
          onChangeReason={onChangeReason}
          onReveal={onReveal}
        />
      )}
    </article>
  );
}

function PredictStep({
  scenario,
  row,
  onPickBand,
  onChangeReason,
  onReveal,
}: {
  scenario: Scenario;
  row: PerScenarioState;
  onPickBand: (band: string) => void;
  onChangeReason: (reason: string) => void;
  onReveal: () => void;
}) {
  const bands = trackBands[scenario.track];

  return (
    <div className="mt-6 grid gap-8">
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">
          Facts to level
        </h3>
        <ul
          className="mt-3 grid gap-2 text-sm leading-6"
          style={{ color: "var(--muted)" }}
        >
          {scenario.facts.map((fact) => (
            <li key={fact} className="flex gap-2">
              <span aria-hidden="true">·</span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-base font-semibold">{PREDICT_INTRO_HEAD}</h3>
        <p
          className="mt-2 max-w-2xl text-sm leading-6"
          style={{ color: "var(--muted)" }}
        >
          {PREDICT_INTRO_BODY}
        </p>
      </section>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold">Predicted level</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {bands.map((band) => (
            <BandCard
              key={band}
              name={`predicted-band-${scenario.id}`}
              value={band}
              label={band}
              sublabel={
                levelNames[band as keyof typeof levelNames] ?? undefined
              }
              checked={row.predictedBand === band}
              onChange={() => onPickBand(band)}
            />
          ))}
          {SUFFIX_BANDS.map((band) => (
            <BandCard
              key={band}
              name={`predicted-band-${scenario.id}`}
              value={band}
              label={band}
              checked={row.predictedBand === band}
              onChange={() => onPickBand(band)}
            />
          ))}
        </div>
      </fieldset>

      <div className="grid gap-2">
        <label
          htmlFor={`reason-${scenario.id}`}
          className="text-sm font-semibold"
        >
          Your reasoning
        </label>
        <input
          id={`reason-${scenario.id}`}
          type="text"
          maxLength={120}
          value={row.reason}
          onChange={(e) => onChangeReason(e.target.value)}
          placeholder="Why? (Optional, 120 chars.)"
          className="rounded-[6px] border px-3 py-2 text-sm"
          style={{
            borderColor: "var(--line)",
            background: "var(--bg-alt)",
            color: "var(--text)",
          }}
        />
        <p className="mono text-xs" style={{ color: "var(--text-muted)" }}>
          {row.reason.length} / 120
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!row.predictedBand}
          onClick={onReveal}
          style={{
            opacity: row.predictedBand ? 1 : 0.5,
            cursor: row.predictedBand ? "pointer" : "not-allowed",
          }}
        >
          See the recommended answer.
        </button>
      </div>
    </div>
  );
}

function BandCard({
  name,
  value,
  label,
  sublabel,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className="flex cursor-pointer items-start gap-3 rounded-[8px] border px-3 py-3 transition-colors"
      style={{
        borderColor: checked ? "var(--accent)" : "var(--line)",
        background: checked ? "var(--accent-soft)" : "var(--bg-alt)",
      }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-1"
      />
      <span className="grid gap-0.5">
        <span className="mono text-sm font-semibold">{label}</span>
        {sublabel ? (
          <span
            className="text-xs leading-tight"
            style={{ color: "var(--text-muted)" }}
          >
            {sublabel}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function compareBands(predicted: string | null, recommended: string): boolean {
  if (!predicted) return false;
  if (predicted === recommended) return true;
  // Recommended formats: "P4", "P4 (boundary P4/P5)".
  const baseBand = recommended.split(" ")[0];
  const isBoundary = recommended.includes("(boundary");
  if (predicted === baseBand) return true;
  if (predicted === "On a boundary" && isBoundary) return true;
  return false;
}

function RevealStep({
  scenario,
  row,
  onBackToPredict,
  onNext,
  allRevealed,
}: {
  scenario: Scenario;
  row: PerScenarioState;
  onBackToPredict: () => void;
  onNext: () => void;
  allRevealed: boolean;
}) {
  const matched = compareBands(row.predictedBand, scenario.recommendedBand);

  return (
    <div className="mt-6 grid gap-6">
      <EvidenceList
        title="Strongest evidence"
        items={scenario.strongestEvidence}
        chipColor="var(--green)"
        chipBg="var(--green-bg)"
        chipBorder="var(--green-border)"
      />

      <EvidenceList
        title="Watch-outs"
        items={scenario.watchOuts}
        chipColor="var(--amber)"
        chipBg="var(--amber-bg)"
        chipBorder="var(--amber-border)"
      />

      <section
        role="status"
        aria-live="polite"
        className="rounded-[8px] border p-5"
        style={{
          borderColor: "var(--accent)",
          background: "var(--accent-soft)",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-[0.22em]"
          style={{ color: "var(--accent)" }}
        >
          Recommended band
        </p>
        <p
          className="mono mt-2 text-3xl font-semibold md:text-4xl"
          style={{ color: "var(--accent)" }}
        >
          {scenario.recommendedBand}
        </p>
        {row.predictedBand ? (
          <p
            className="mt-3 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            <span className="mono">Your prediction: {row.predictedBand}</span>
            <span aria-hidden="true"> · </span>
            <span
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: matched ? "var(--green)" : "var(--amber)" }}
            >
              {matched ? "matched" : "different"}
            </span>
          </p>
        ) : null}
        {row.reason ? (
          <p
            className="mt-2 text-sm italic"
            style={{ color: "var(--text-secondary)" }}
          >
            &ldquo;{row.reason}&rdquo;
          </p>
        ) : null}
      </section>

      <CalibrationQuestionBlock question={scenario.calibrationQuestion} />

      <section
        className="rounded-[8px] border p-5"
        style={{ borderColor: "var(--line)", background: "var(--bg-alt)" }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-[0.22em]"
          style={{ color: "var(--text-muted)" }}
        >
          Reflect
        </p>
        <p
          className="mt-2 text-sm leading-6"
          style={{ color: "var(--muted)" }}
        >
          {REFLECT_PROMPT}
        </p>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primary" onClick={onNext}>
          {allRevealed ? "Start the session over" : "Try the next scenario →"}
        </button>
        <button type="button" className="btn" onClick={onBackToPredict}>
          Back to predict
        </button>
      </div>
    </div>
  );
}

function EvidenceList({
  title,
  items,
  chipColor,
  chipBg,
  chipBorder,
}: {
  title: string;
  items: string[];
  chipColor: string;
  chipBg: string;
  chipBorder: string;
}) {
  return (
    <section>
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">
        {title}
      </h3>
      <ul className="mt-3 grid gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm leading-6"
            style={{ color: "var(--muted)" }}
          >
            <span
              aria-hidden="true"
              className="mt-1.5 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full border-2"
              style={{
                background: chipColor,
                borderColor: chipBorder,
                outline: `2px solid ${chipBg}`,
              }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CalibrationQuestionBlock({ question }: { question: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(question);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      className="rounded-[8px] border p-5"
      style={{ borderColor: "var(--line)", background: "var(--surface-alt)" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className="text-xs font-semibold uppercase tracking-[0.22em]"
          style={{ color: "var(--text-muted)" }}
        >
          Calibration question
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--accent)" }}
          aria-live="polite"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p
        className="mt-3 text-base italic leading-7"
        style={{ color: "var(--text-secondary)" }}
      >
        {question}
      </p>
    </section>
  );
}
