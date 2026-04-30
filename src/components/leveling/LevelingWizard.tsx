"use client";

import { useMemo, useState } from "react";
import {
  dimensions,
  roleTypeOptions,
  type DimensionId,
  type RoleType,
} from "@/data/leveling";
import {
  buildSummaryText,
  calculateLevelingResult,
  requiredDimensionIds,
  roleTypeLabel,
  type LevelingScores,
} from "@/lib/leveling";

type WizardStep = "role" | "questions" | "review" | "result";

export default function LevelingWizard() {
  const [step, setStep] = useState<WizardStep>("role");
  const [roleType, setRoleType] = useState<RoleType | null>(null);
  const [showUnsure, setShowUnsure] = useState(false);
  const [managesPeople, setManagesPeople] = useState<boolean | null>(null);
  const [ownsStrategy, setOwnsStrategy] = useState<boolean | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState<LevelingScores>({});

  const activeDimensions = useMemo(() => {
    if (!roleType) return [];
    return dimensions.filter(
      (dimension) =>
        dimension.appliesTo === "all" || dimension.appliesTo === roleType,
    );
  }, [roleType]);

  const answeredCount = activeDimensions.filter(
    (dimension) => scores[dimension.id],
  ).length;
  const complete =
    roleType !== null &&
    requiredDimensionIds(roleType).every((id) => Boolean(scores[id]));
  const result = useMemo(() => {
    if (!roleType || !complete) return null;
    return calculateLevelingResult(roleType, scores);
  }, [complete, roleType, scores]);

  function selectRole(next: RoleType | "unsure") {
    if (next === "unsure") {
      setShowUnsure(true);
      return;
    }

    setRoleType(next);
    setScores({});
    setQuestionIndex(0);
    setStep("questions");
  }

  function resolveUnsure() {
    const resolved: RoleType = ownsStrategy
      ? "executive"
      : managesPeople
        ? "manager"
        : "ic";
    setRoleType(resolved);
    setScores({});
    setQuestionIndex(0);
    setShowUnsure(false);
    setStep("questions");
  }

  function setScore(id: DimensionId, score: number) {
    setScores((current) => ({ ...current, [id]: score }));
  }

  function reset() {
    setStep("role");
    setRoleType(null);
    setShowUnsure(false);
    setManagesPeople(null);
    setOwnsStrategy(null);
    setQuestionIndex(0);
    setScores({});
  }

  return (
    <section aria-label="Directional leveling wizard">
      <div
        className="rounded-[var(--radius-card)] border"
        style={{
          borderColor: "var(--line)",
          background: "var(--surface)",
        }}
      >
        <div className="border-b p-5 md:p-6" style={{ borderColor: "var(--line)" }}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p
                className="text-xs font-medium uppercase tracking-[0.32em]"
                style={{ color: "var(--accent)" }}
              >
                Directional leveling
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Classify a role in under 3 minutes.
              </h1>
            </div>
            <button
              type="button"
              onClick={reset}
              className="self-start rounded-full border px-4 py-2 text-sm font-semibold"
              style={{
                borderColor: "var(--line)",
                color: "var(--text)",
              }}
            >
              Reset
            </button>
          </div>
          <Progress
            step={step}
            answeredCount={answeredCount}
            total={activeDimensions.length || 6}
          />
        </div>

        {step === "role" && (
          <div className="p-5 md:p-6">
            <p className="max-w-3xl leading-7" style={{ color: "var(--muted)" }}>
              Pick the path that best describes how the role creates leverage.
              If you are not sure, use the helper. The recommendation remains
              directional and should be calibrated internally.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {roleTypeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => selectRole(option.id)}
                  className="rounded-[8px] border p-5 text-left transition-colors"
                  style={{
                    borderColor: "var(--line)",
                    background: "var(--surface-alt)",
                  }}
                >
                  <span className="block text-lg font-semibold">
                    {option.title}
                  </span>
                  <span
                    className="mt-2 block text-sm leading-6"
                    style={{ color: "var(--muted)" }}
                  >
                    {option.body}
                  </span>
                </button>
              ))}
            </div>

            {showUnsure && (
              <div
                className="mt-6 rounded-[8px] border p-5"
                style={{
                  borderColor: "var(--accent)",
                  background: "var(--accent-soft)",
                }}
              >
                <p className="text-lg font-semibold">Role type helper</p>
                <BinaryQuestion
                  label="Does this role formally manage people outcomes?"
                  value={managesPeople}
                  onChange={setManagesPeople}
                />
                <BinaryQuestion
                  label="Does this role own durable business, regional, functional, or enterprise strategy?"
                  value={ownsStrategy}
                  onChange={setOwnsStrategy}
                />
                <button
                  type="button"
                  disabled={managesPeople === null || ownsStrategy === null}
                  onClick={resolveUnsure}
                  className="mt-5 rounded-full border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    borderColor: "var(--accent)",
                    background: "var(--surface)",
                    color: "var(--text)",
                  }}
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        )}

        {step === "questions" && roleType && activeDimensions[questionIndex] && (
          <QuestionStep
            dimension={activeDimensions[questionIndex]}
            score={scores[activeDimensions[questionIndex].id] ?? null}
            index={questionIndex}
            total={activeDimensions.length}
            roleType={roleType}
            onScore={setScore}
            onBack={() => {
              if (questionIndex === 0) {
                setStep("role");
              } else {
                setQuestionIndex((index) => index - 1);
              }
            }}
            onNext={() => {
              if (questionIndex === activeDimensions.length - 1) {
                setStep("review");
              } else {
                setQuestionIndex((index) => index + 1);
              }
            }}
          />
        )}

        {step === "review" && roleType && (
          <ReviewStep
            roleType={roleType}
            dimensions={activeDimensions}
            scores={scores}
            complete={complete}
            onEdit={(index) => {
              setQuestionIndex(index);
              setStep("questions");
            }}
            onSubmit={() => setStep("result")}
          />
        )}

        {step === "result" && result && (
          <ResultStep
            result={result}
            onEdit={() => setStep("review")}
            onStartOver={reset}
          />
        )}
      </div>
    </section>
  );
}

function Progress({
  step,
  answeredCount,
  total,
}: {
  step: WizardStep;
  answeredCount: number;
  total: number;
}) {
  const stepNumber =
    step === "role" ? 1 : step === "questions" ? 2 : step === "review" ? 3 : 4;
  const percent =
    step === "questions"
      ? Math.max(20, Math.round((answeredCount / total) * 75))
      : stepNumber * 25;

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: "var(--text-muted)" }}>Step {stepNumber} of 4</span>
        <span className="mono" style={{ color: "var(--text-muted)" }}>
          {step === "questions" ? `${answeredCount}/${total} answered` : `${percent}%`}
        </span>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full"
        style={{ background: "var(--bg-alt)" }}
      >
        <div
          className="h-full rounded-full transition-[width]"
          style={{
            width: `${percent}%`,
            background: "var(--accent)",
          }}
        />
      </div>
    </div>
  );
}

function BinaryQuestion({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="mt-4">
      <p className="text-sm font-semibold">{label}</p>
      <div className="mt-2 flex gap-2">
        {[true, false].map((option) => {
          const selected = value === option;
          return (
            <button
              key={String(option)}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={selected}
              className="rounded-full border px-4 py-2 text-sm font-semibold"
              style={{
                borderColor: selected ? "var(--accent)" : "var(--line)",
                background: selected ? "var(--surface)" : "transparent",
                color: "var(--text)",
              }}
            >
              {option ? "Yes" : "No"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuestionStep({
  dimension,
  score,
  index,
  total,
  roleType,
  onScore,
  onBack,
  onNext,
}: {
  dimension: (typeof dimensions)[number];
  score: number | null;
  index: number;
  total: number;
  roleType: RoleType;
  onScore: (id: DimensionId, score: number) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="p-5 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p
            className="text-xs font-medium uppercase tracking-[0.28em]"
            style={{ color: "var(--text-muted)" }}
          >
            {roleTypeLabel(roleType)} dimension {index + 1} of {total}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            {dimension.title}
          </h2>
          <p className="mt-2 leading-7" style={{ color: "var(--muted)" }}>
            {dimension.prompt}
          </p>
        </div>
        <p className="mono text-sm" style={{ color: "var(--text-muted)" }}>
          Score {score ?? "-"}
        </p>
      </div>

      <div className="mt-6 grid gap-3">
        {dimension.options.map((option) => {
          const selected = score === option.score;
          return (
            <button
              key={option.score}
              type="button"
              onClick={() => onScore(dimension.id, option.score)}
              aria-pressed={selected}
              className="rounded-[8px] border p-4 text-left transition-colors"
              style={{
                borderColor: selected ? "var(--accent)" : "var(--line)",
                background: selected ? "var(--accent-soft)" : "var(--surface-alt)",
              }}
            >
              <span className="flex items-start justify-between gap-4">
                <span>
                  <span className="block font-semibold">{option.label}</span>
                  <span
                    className="mt-1 block text-sm leading-6"
                    style={{ color: "var(--muted)" }}
                  >
                    {option.description}
                  </span>
                </span>
                <span
                  className="mono rounded-full border px-2 py-0.5 text-xs"
                  style={{
                    borderColor: selected ? "var(--accent)" : "var(--line)",
                    color: selected ? "var(--text)" : "var(--text-muted)",
                  }}
                >
                  {option.score}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border px-4 py-2 text-sm font-semibold"
          style={{
            borderColor: "var(--line)",
            color: "var(--text)",
          }}
        >
          Back
        </button>
        <button
          type="button"
          disabled={!score}
          onClick={onNext}
          className="rounded-full border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            borderColor: "var(--accent)",
            background: "var(--accent-soft)",
            color: "var(--text)",
          }}
        >
          {index === total - 1 ? "Review inputs" : "Next"}
        </button>
      </div>
    </div>
  );
}

function ReviewStep({
  roleType,
  dimensions,
  scores,
  complete,
  onEdit,
  onSubmit,
}: {
  roleType: RoleType;
  dimensions: typeof import("@/data/leveling").dimensions;
  scores: LevelingScores;
  complete: boolean;
  onEdit: (index: number) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="p-5 md:p-6">
      <p
        className="text-xs font-medium uppercase tracking-[0.28em]"
        style={{ color: "var(--text-muted)" }}
      >
        Review
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight">
        Check the evidence before the recommendation.
      </h2>
      <p className="mt-3 leading-7" style={{ color: "var(--muted)" }}>
        Role type: <span style={{ color: "var(--text)" }}>{roleTypeLabel(roleType)}</span>
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {dimensions.map((dimension, index) => (
          <button
            key={dimension.id}
            type="button"
            onClick={() => onEdit(index)}
            className="rounded-[8px] border p-4 text-left"
            style={{
              borderColor: scores[dimension.id] ? "var(--line)" : "var(--amber-border)",
              background: "var(--surface-alt)",
            }}
          >
            <span className="flex items-center justify-between gap-4">
              <span>
                <span className="block font-semibold">{dimension.title}</span>
                <span className="mt-1 block text-sm" style={{ color: "var(--muted)" }}>
                  Click to edit
                </span>
              </span>
              <span className="mono text-lg font-semibold">
                {scores[dimension.id] ?? "-"}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={!complete}
          onClick={onSubmit}
          className="rounded-full border px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            borderColor: "var(--accent)",
            background: "var(--accent-soft)",
            color: "var(--text)",
          }}
        >
          Generate result
        </button>
      </div>
    </div>
  );
}

function ResultStep({
  result,
  onEdit,
  onStartOver,
}: {
  result: NonNullable<ReturnType<typeof calculateLevelingResult>>;
  onEdit: () => void;
  onStartOver: () => void;
}) {
  function exportSummary() {
    const blob = new Blob([buildSummaryText(result)], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `jobarchitecture-summary-${result.levelCode.toLowerCase()}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-5 md:p-6">
      <p
        className="text-xs font-medium uppercase tracking-[0.28em]"
        style={{ color: "var(--accent)" }}
      >
        Recommended level
      </p>
      <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-5xl font-semibold tracking-tight">
            {result.levelCode}
          </h2>
          <p className="mt-2 text-2xl font-medium">{result.levelName}</p>
        </div>
        <div className="grid gap-2 text-sm md:text-right">
          <p>
            <span style={{ color: "var(--text-muted)" }}>Confidence: </span>
            <span className="font-semibold">{result.confidence}</span>
          </p>
          <p>
            <span style={{ color: "var(--text-muted)" }}>Score: </span>
            <span className="mono font-semibold">{result.weightedScore}</span>
          </p>
          <p>
            <span style={{ color: "var(--text-muted)" }}>Boundary: </span>
            <span className="font-semibold">{result.boundary ?? "None"}</span>
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <ResultBlock title="Explanation" body={result.explanation} />
        <ResultBlock title="What would move it up" body={result.moveUp} />
        <ResultBlock title="What would move it down" body={result.moveDown} />
        <ResultBlock title="Calibration prompt" body={result.calibrationPrompt} />
      </div>

      <div className="mt-8">
        <p className="text-sm font-semibold">Dimension pattern</p>
        <div className="mt-3 grid gap-2">
          {result.dimensionRows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[120px_1fr_40px] items-center gap-3 text-sm"
            >
              <span>{row.label}</span>
              <span
                className="h-2 overflow-hidden rounded-full"
                style={{ background: "var(--bg-alt)" }}
              >
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${(row.score / 7) * 100}%`,
                    background: "var(--accent)",
                  }}
                />
              </span>
              <span className="mono text-right">{row.score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm font-semibold">Flags</p>
        {result.flags.length ? (
          <ul className="mt-3 grid gap-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
            {result.flags.map((flag) => (
              <li key={flag}>- {flag}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
            No sanity-check flags were triggered.
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={exportSummary}
          className="rounded-full border px-4 py-2 text-sm font-semibold"
          style={{
            borderColor: "var(--accent)",
            background: "var(--accent-soft)",
            color: "var(--text)",
          }}
        >
          Download text summary
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full border px-4 py-2 text-sm font-semibold"
          style={{
            borderColor: "var(--line)",
            color: "var(--text)",
          }}
        >
          Edit inputs
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="rounded-full border px-4 py-2 text-sm font-semibold"
          style={{
            borderColor: "var(--line)",
            color: "var(--text)",
          }}
        >
          Start over
        </button>
      </div>
    </div>
  );
}

function ResultBlock({ title, body }: { title: string; body: string }) {
  return (
    <section
      className="rounded-[8px] border p-4"
      style={{
        borderColor: "var(--line)",
        background: "var(--surface-alt)",
      }}
    >
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
        {body}
      </p>
    </section>
  );
}
