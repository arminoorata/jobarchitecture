"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import {
  dimensions,
  roleTypeOptions,
  type Dimension,
  type DimensionId,
  type RoleType,
} from "@/data/leveling";
import {
  buildSummaryText,
  calculateLevelingResult,
  requiredDimensionIds,
  roleTypeLabel,
  type LevelingResult,
  type LevelingScores,
} from "@/lib/leveling";

type WizardStep = "role" | "questions" | "review" | "result";

type WizardState = {
  step: WizardStep;
  roleType: RoleType | null;
  showUnsure: boolean;
  managesPeople: boolean | null;
  ownsStrategy: boolean | null;
  questionIndex: number;
  scores: LevelingScores;
  result: LevelingResult | null;
  validationError: DimensionId | null;
  errorNotice: string | null;
};

type WizardAction =
  | { type: "SELECT_ROLE"; roleType: RoleType }
  | { type: "OPEN_UNSURE" }
  | { type: "SET_MANAGES"; value: boolean }
  | { type: "SET_OWNS_STRATEGY"; value: boolean }
  | { type: "RESOLVE_UNSURE"; resolved: RoleType }
  | { type: "SET_SCORE"; id: DimensionId; score: number }
  | { type: "GO_PREV" }
  | { type: "GO_NEXT"; missingId: DimensionId | null; lastIndex: boolean }
  | { type: "GO_REVIEW" }
  | { type: "EDIT_DIMENSION"; index: number }
  | { type: "SUBMIT"; result: LevelingResult }
  | { type: "SUBMIT_FAILED" }
  | { type: "CLEAR_VALIDATION" }
  | { type: "RESET" };

const initialState: WizardState = {
  step: "role",
  roleType: null,
  showUnsure: false,
  managesPeople: null,
  ownsStrategy: null,
  questionIndex: 0,
  scores: {},
  result: null,
  validationError: null,
  errorNotice: null,
};

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SELECT_ROLE":
      return {
        ...initialState,
        step: "questions",
        roleType: action.roleType,
      };
    case "OPEN_UNSURE":
      return { ...state, showUnsure: true };
    case "SET_MANAGES":
      return { ...state, managesPeople: action.value };
    case "SET_OWNS_STRATEGY":
      return { ...state, ownsStrategy: action.value };
    case "RESOLVE_UNSURE":
      return {
        ...initialState,
        step: "questions",
        roleType: action.resolved,
      };
    case "SET_SCORE":
      return {
        ...state,
        scores: { ...state.scores, [action.id]: action.score },
        validationError:
          state.validationError === action.id ? null : state.validationError,
      };
    case "GO_PREV":
      if (state.questionIndex === 0) {
        return { ...state, step: "role", validationError: null };
      }
      return {
        ...state,
        questionIndex: state.questionIndex - 1,
        validationError: null,
      };
    case "GO_NEXT":
      if (action.missingId) {
        return { ...state, validationError: action.missingId };
      }
      if (action.lastIndex) {
        return { ...state, step: "review", validationError: null };
      }
      return {
        ...state,
        questionIndex: state.questionIndex + 1,
        validationError: null,
      };
    case "GO_REVIEW":
      return { ...state, step: "review", validationError: null };
    case "EDIT_DIMENSION":
      return {
        ...state,
        step: "questions",
        questionIndex: action.index,
        validationError: null,
      };
    case "SUBMIT":
      return {
        ...state,
        step: "result",
        result: action.result,
        validationError: null,
        errorNotice: null,
      };
    case "SUBMIT_FAILED":
      return {
        ...initialState,
        errorNotice: "Couldn't read those answers. Starting fresh.",
      };
    case "CLEAR_VALIDATION":
      return { ...state, validationError: null };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

export default function LevelingWizard() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    step,
    roleType,
    showUnsure,
    managesPeople,
    ownsStrategy,
    questionIndex,
    scores,
    result,
    validationError,
    errorNotice,
  } = state;

  const activeDimensions = useMemo<Dimension[]>(() => {
    if (!roleType) return [];
    const ids = requiredDimensionIds(roleType);
    return ids
      .map((id) => dimensions.find((d) => d.id === id))
      .filter((d): d is Dimension => Boolean(d));
  }, [roleType]);

  const stepHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const missingCardRef = useRef<HTMLDivElement | null>(null);

  // Focus management: move focus to the new step's heading on transitions.
  useEffect(() => {
    if (stepHeadingRef.current) {
      stepHeadingRef.current.focus();
    }
  }, [step, questionIndex]);

  // Scroll the missing dimension into view when validation fires.
  useEffect(() => {
    if (validationError && missingCardRef.current) {
      missingCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [validationError]);

  function selectRole(next: RoleType | "unsure") {
    if (next === "unsure") {
      dispatch({ type: "OPEN_UNSURE" });
      return;
    }
    dispatch({ type: "SELECT_ROLE", roleType: next });
  }

  function resolveUnsure() {
    if (managesPeople === null || ownsStrategy === null) return;
    const resolved: RoleType = ownsStrategy
      ? "executive"
      : managesPeople
        ? "manager"
        : "ic";
    dispatch({ type: "RESOLVE_UNSURE", resolved });
  }

  // Auto-advance once both helper questions are answered.
  useEffect(() => {
    if (showUnsure && managesPeople !== null && ownsStrategy !== null) {
      resolveUnsure();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managesPeople, ownsStrategy, showUnsure]);

  function setScore(id: DimensionId, score: number) {
    dispatch({ type: "SET_SCORE", id, score });
  }

  function goNext() {
    const current = activeDimensions[questionIndex];
    if (!current) return;
    const isLast = questionIndex === activeDimensions.length - 1;
    if (!scores[current.id]) {
      dispatch({ type: "GO_NEXT", missingId: current.id, lastIndex: false });
      return;
    }
    dispatch({ type: "GO_NEXT", missingId: null, lastIndex: isLast });
  }

  // Auto-advance handler: called by the QuestionStep right after a score is
  // selected. Skips the score-presence check because the score was just set
  // (the closure may still read stale `scores`, but the dispatch has flushed
  // by the time this fires).
  function advanceFromAutoSelect() {
    const isLast = questionIndex === activeDimensions.length - 1;
    dispatch({ type: "GO_NEXT", missingId: null, lastIndex: isLast });
  }

  function goReview() {
    // Spec §9.4: "Skip to review" is permitted once at least three dimensions
    // are answered. The review screen keeps "See the level" disabled until
    // every required dimension has a score.
    dispatch({ type: "GO_REVIEW" });
  }

  function submit() {
    if (!roleType) return;
    const required = requiredDimensionIds(roleType);
    const missing = required.find((id) => !scores[id]);
    if (missing) {
      const idx = activeDimensions.findIndex((d) => d.id === missing);
      dispatch({
        type: "EDIT_DIMENSION",
        index: idx >= 0 ? idx : 0,
      });
      return;
    }
    try {
      const computed = calculateLevelingResult(roleType, scores);
      dispatch({ type: "SUBMIT", result: computed });
    } catch {
      dispatch({ type: "SUBMIT_FAILED" });
    }
  }

  function reset() {
    dispatch({ type: "RESET" });
  }

  return (
    <section aria-label="Directional leveling wizard">
      {errorNotice ? (
        <p
          role="status"
          aria-live="polite"
          className="mb-4 text-sm italic"
          style={{ color: "var(--text-muted)" }}
        >
          {errorNotice}
        </p>
      ) : null}

      <div
        className="rounded-[var(--radius-card)] border"
        style={{
          borderColor: "var(--line)",
          background: "var(--surface)",
        }}
      >
        <div
          className="border-b p-5 md:p-6"
          style={{ borderColor: "var(--line)" }}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p
                className="text-xs font-medium uppercase tracking-[0.32em]"
                style={{ color: "var(--accent)" }}
              >
                Directional leveling
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Classify a role in under 3 minutes.
              </h2>
            </div>
            {step !== "role" || showUnsure ? (
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
            ) : null}
          </div>
          <StepIndicator
            step={step}
            activeDimensions={activeDimensions}
            questionIndex={questionIndex}
            scores={scores}
            validationError={validationError}
          />
        </div>

        {step === "role" && (
          <RolePickerStep
            headingRef={stepHeadingRef}
            showUnsure={showUnsure}
            managesPeople={managesPeople}
            ownsStrategy={ownsStrategy}
            onSelectRole={selectRole}
            onSetManages={(v) => dispatch({ type: "SET_MANAGES", value: v })}
            onSetOwns={(v) =>
              dispatch({ type: "SET_OWNS_STRATEGY", value: v })
            }
          />
        )}

        {step === "questions" &&
          roleType &&
          activeDimensions[questionIndex] && (
            <QuestionStep
              headingRef={stepHeadingRef}
              missingCardRef={missingCardRef}
              dimension={activeDimensions[questionIndex]}
              score={scores[activeDimensions[questionIndex].id] ?? null}
              index={questionIndex}
              total={activeDimensions.length}
              roleType={roleType}
              hasValidationError={
                validationError === activeDimensions[questionIndex].id
              }
              answeredCount={
                requiredDimensionIds(roleType).filter((id) => scores[id]).length
              }
              onScore={setScore}
              onBack={() => dispatch({ type: "GO_PREV" })}
              onNext={goNext}
              onAutoAdvance={advanceFromAutoSelect}
              onSkipToReview={goReview}
            />
          )}

        {step === "review" && roleType && (
          <ReviewStep
            headingRef={stepHeadingRef}
            roleType={roleType}
            dimensions={activeDimensions}
            scores={scores}
            onEdit={(index) =>
              dispatch({ type: "EDIT_DIMENSION", index })
            }
            onSubmit={submit}
          />
        )}

        {step === "result" && result && (
          <ResultStep
            headingRef={stepHeadingRef}
            result={result}
            roleType={result.roleType}
            requiredOrder={requiredDimensionIds(result.roleType)}
            onStartOver={reset}
          />
        )}
      </div>
    </section>
  );
}

function StepIndicator({
  step,
  activeDimensions,
  questionIndex,
  scores,
  validationError,
}: {
  step: WizardStep;
  activeDimensions: Dimension[];
  questionIndex: number;
  scores: LevelingScores;
  validationError: DimensionId | null;
}) {
  // Build a chip list: Role + each dimension + Review.
  const chips: Array<{
    key: string;
    label: string;
    state: "completed" | "current" | "future";
    error: boolean;
  }> = [];

  const onRole = step === "role";
  chips.push({
    key: "role",
    label: "Role",
    state: onRole ? "current" : "completed",
    error: false,
  });

  activeDimensions.forEach((dimension, index) => {
    let chipState: "completed" | "current" | "future" = "future";
    if (step === "questions") {
      if (index < questionIndex) chipState = "completed";
      else if (index === questionIndex) chipState = "current";
      else if (scores[dimension.id]) chipState = "completed";
    } else if (step === "review" || step === "result") {
      chipState = scores[dimension.id] ? "completed" : "future";
    }
    chips.push({
      key: dimension.id,
      label: dimension.shortLabel,
      state: chipState,
      error: validationError === dimension.id,
    });
  });

  chips.push({
    key: "review",
    label: "Review",
    state:
      step === "review"
        ? "current"
        : step === "result"
          ? "completed"
          : "future",
    error: false,
  });

  chips.push({
    key: "result",
    label: "Result",
    state: step === "result" ? "current" : "future",
    error: false,
  });

  const totalSteps = chips.length;
  const currentIndex = chips.findIndex((chip) => chip.state === "current");
  const stepNumber =
    currentIndex >= 0
      ? currentIndex + 1
      : step === "result"
        ? totalSteps
        : 1;

  const percent = Math.round((stepNumber / totalSteps) * 100);

  return (
    <div className="mt-5">
      {/* Mobile: text + thin progress bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: "var(--text-muted)" }}>
            Step {stepNumber} of {totalSteps}
          </span>
          <span className="mono" style={{ color: "var(--text-muted)" }}>
            {percent}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Wizard progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="mt-2 h-1.5 overflow-hidden rounded-full"
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

      {/* Desktop: segmented chip bar */}
      <ol
        className="mt-1 hidden flex-wrap items-center gap-2 md:flex"
        aria-label="Wizard progress"
      >
        {chips.map((chip) => {
          const isCurrent = chip.state === "current";
          const isCompleted = chip.state === "completed";
          const isError = chip.error;
          const background = isError
            ? "var(--red-bg)"
            : isCompleted
              ? "var(--accent)"
              : isCurrent
                ? "transparent"
                : "var(--surface-alt)";
          const borderColor = isError
            ? "var(--red-border)"
            : isCurrent
              ? "var(--accent-strong)"
              : isCompleted
                ? "var(--accent)"
                : "var(--line)";
          const color = isError
            ? "var(--red)"
            : isCompleted
              ? "var(--bg)"
              : isCurrent
                ? "var(--text)"
                : "var(--text-muted)";
          return (
            <li
              key={chip.key}
              aria-current={isCurrent ? "step" : undefined}
              className="rounded-full border px-3 py-1 text-xs font-medium"
              style={{
                background,
                borderColor,
                color,
              }}
            >
              {chip.label}
              {isError ? (
                <span className="sr-only">, needs an answer</span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function RolePickerStep({
  headingRef,
  showUnsure,
  managesPeople,
  ownsStrategy,
  onSelectRole,
  onSetManages,
  onSetOwns,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  showUnsure: boolean;
  managesPeople: boolean | null;
  ownsStrategy: boolean | null;
  onSelectRole: (id: RoleType | "unsure") => void;
  onSetManages: (value: boolean) => void;
  onSetOwns: (value: boolean) => void;
}) {
  return (
    <div className="p-5 md:p-6">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-semibold tracking-tight outline-none md:text-3xl"
      >
        Pick the kind of role you&apos;re sizing.
      </h2>
      <p className="mt-3 max-w-3xl leading-7" style={{ color: "var(--muted)" }}>
        The tool weights people-leadership and strategy slightly differently
        for manager and executive tracks. If you&apos;re not sure, &ldquo;Not
        sure&rdquo; works just fine.
      </p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {roleTypeOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelectRole(option.id)}
            className="rounded-[8px] border p-5 text-left transition-colors"
            style={{
              borderColor: "var(--line)",
              background: "var(--surface-alt)",
            }}
          >
            <span className="block text-lg font-semibold">{option.title}</span>
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
          <p className="text-lg font-semibold">Two quick questions.</p>
          <BinaryQuestion
            label="Does this role formally manage people outcomes?"
            value={managesPeople}
            onChange={onSetManages}
          />
          <BinaryQuestion
            label="Does this role own durable business, regional, functional, or enterprise strategy?"
            value={ownsStrategy}
            onChange={onSetOwns}
          />
          <p
            className="mt-4 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Answer both and we&apos;ll move on.
          </p>
        </div>
      )}
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
  headingRef,
  missingCardRef,
  dimension,
  score,
  index,
  total,
  roleType,
  hasValidationError,
  answeredCount,
  onScore,
  onBack,
  onNext,
  onAutoAdvance,
  onSkipToReview,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  missingCardRef: React.RefObject<HTMLDivElement | null>;
  dimension: Dimension;
  score: number | null;
  index: number;
  total: number;
  roleType: RoleType;
  hasValidationError: boolean;
  answeredCount: number;
  onScore: (id: DimensionId, score: number) => void;
  onBack: () => void;
  onNext: () => void;
  onAutoAdvance: () => void;
  onSkipToReview: () => void;
}) {
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // When true, the wizard does not auto-advance and shows an explicit Continue
  // button per spec §9.4.
  const reducedMotion = useReducedMotion();

  // Cancel pending auto-advance on unmount or dimension change.
  useEffect(() => {
    return () => {
      if (advanceTimer.current) {
        clearTimeout(advanceTimer.current);
        advanceTimer.current = null;
      }
    };
  }, [dimension.id]);

  function handleSelect(value: number) {
    onScore(dimension.id, value);
    if (reducedMotion) return;
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      onAutoAdvance();
    }, 200);
  }

  return (
    <div
      ref={hasValidationError ? missingCardRef : undefined}
      className="p-5 md:p-6"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p
            className="text-xs font-medium uppercase tracking-[0.28em]"
            style={{ color: "var(--text-muted)" }}
          >
            {roleTypeLabel(roleType)} dimension {index + 1} of {total}
          </p>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-3 text-3xl font-semibold tracking-tight outline-none"
          >
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

      {dimension.whatThisMeans || dimension.commonMistake ? (
        <details
          className="mt-4 rounded-[8px] border p-3"
          style={{
            borderColor: "var(--line)",
            background: "var(--surface-alt)",
          }}
        >
          <summary
            className="cursor-pointer text-sm font-semibold leading-6 marker:text-[var(--accent)]"
            style={{ color: "var(--text)" }}
          >
            What this dimension means
          </summary>
          {dimension.whatThisMeans ? (
            <p
              className="mt-2 text-sm leading-6"
              style={{ color: "var(--muted)" }}
            >
              {dimension.whatThisMeans}
            </p>
          ) : null}
          {dimension.commonMistake ? (
            <p
              className="mt-2 text-sm leading-6"
              style={{ color: "var(--muted)" }}
            >
              {dimension.commonMistake}
            </p>
          ) : null}
        </details>
      ) : null}

      <div className="mt-6 grid gap-3">
        {dimension.options.map((option) => {
          const selected = score === option.score;
          return (
            <button
              key={option.score}
              type="button"
              onClick={() => handleSelect(option.score)}
              aria-pressed={selected}
              className="rounded-[8px] border p-4 text-left transition-colors"
              style={{
                borderColor: selected ? "var(--accent)" : "var(--line)",
                background: selected
                  ? "var(--accent-soft)"
                  : "var(--surface-alt)",
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

      <p
        className="mt-4 text-xs italic"
        style={{ color: "var(--text-muted)" }}
      >
        Pick the option that fits the role most of the time, not the rare
        extreme. Boundary cases work themselves out at the end.
      </p>

      {hasValidationError ? (
        <p
          role="alert"
          aria-live="assertive"
          className="mt-3 text-sm font-medium"
          style={{ color: "var(--red)" }}
        >
          Pick an option for this dimension before moving on.
        </p>
      ) : null}

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
          {"‹ Back"}
        </button>
        <div className="flex items-center gap-2">
          {answeredCount >= 3 && index < total - 1 ? (
            <button
              type="button"
              onClick={onSkipToReview}
              className="rounded-full border px-4 py-2 text-sm font-semibold"
              style={{
                borderColor: "var(--line)",
                color: "var(--text)",
              }}
            >
              {"Skip to review ›"}
            </button>
          ) : null}
          {reducedMotion || index === total - 1 ? (
            <button
              type="button"
              onClick={onNext}
              className="rounded-full border px-4 py-2 text-sm font-semibold"
              style={{
                borderColor: "var(--accent)",
                background: "var(--accent-soft)",
                color: "var(--text)",
              }}
            >
              {index === total - 1 ? "Review inputs" : "Continue"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ReviewStep({
  headingRef,
  roleType,
  dimensions,
  scores,
  onEdit,
  onSubmit,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  roleType: RoleType;
  dimensions: Dimension[];
  scores: LevelingScores;
  onEdit: (index: number) => void;
  onSubmit: () => void;
}) {
  const complete = dimensions.every((d) => scores[d.id]);
  return (
    <div className="p-5 md:p-6">
      <p
        className="text-xs font-medium uppercase tracking-[0.28em]"
        style={{ color: "var(--text-muted)" }}
      >
        Review
      </p>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-3 text-3xl font-semibold tracking-tight outline-none"
      >
        Look this over.
      </h2>
      <p className="mt-3 leading-7" style={{ color: "var(--muted)" }}>
        Edit anything that doesn&apos;t match how the role actually works. The
        math runs the second you click through.
      </p>
      <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
        Role type:{" "}
        <span style={{ color: "var(--text)" }}>
          {roleTypeLabel(roleType)}
        </span>
      </p>

      <ul className="mt-6 grid gap-2">
        {dimensions.map((dimension, index) => {
          const answered = Boolean(scores[dimension.id]);
          return (
            <li
              key={dimension.id}
              className="flex items-center justify-between gap-4 rounded-[8px] border p-4"
              style={{
                borderColor: answered
                  ? "var(--line)"
                  : "var(--amber-border)",
                background: "var(--surface-alt)",
              }}
            >
              <div className="flex flex-1 items-center gap-3">
                <span className="font-semibold">{dimension.title}</span>
                <span
                  className="mono rounded-full border px-2 py-0.5 text-xs"
                  style={{
                    borderColor: answered
                      ? "var(--accent)"
                      : "var(--line)",
                    color: answered ? "var(--text)" : "var(--text-muted)",
                    background: answered
                      ? "var(--accent-soft)"
                      : "transparent",
                  }}
                  aria-label={
                    answered
                      ? `Score ${scores[dimension.id]} of 7`
                      : "No score yet"
                  }
                >
                  {scores[dimension.id] ?? "-"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onEdit(index)}
                className="text-sm font-semibold underline-offset-2 hover:underline"
                style={{ color: "var(--accent)" }}
              >
                Edit
              </button>
            </li>
          );
        })}
      </ul>

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
          See the level
        </button>
      </div>
    </div>
  );
}

function ResultStep({
  headingRef,
  result,
  roleType,
  requiredOrder,
  onStartOver,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  result: LevelingResult;
  roleType: RoleType;
  requiredOrder: DimensionId[];
  onStartOver: () => void;
}) {
  const [copied, setCopied] = useState(false);

  function downloadSummary() {
    const text = buildSummaryText(result);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const filename = `joblevel-summary-${roleType}-${result.levelCode}-${yyyy}${mm}${dd}.txt`;
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  async function copyCalibration() {
    try {
      await navigator.clipboard.writeText(result.calibrationPrompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  // Sort dimension rows by required order so the user reads them in answer order.
  const orderedRows = useMemo(() => {
    const byId = new Map(result.dimensionRows.map((row) => [row.id, row]));
    return requiredOrder
      .map((id) => byId.get(id))
      .filter((row): row is LevelingResult["dimensionRows"][number] =>
        Boolean(row),
      );
  }, [result.dimensionRows, requiredOrder]);

  // Apply empty-join overrides (engine reference §12).
  const moveUpText = result.moveUp.includes("  ")
    ? "This already sits at the top of the dimensions. Moving higher means more of the same dimensions still scoring strongly across a broader scope."
    : result.moveUp;
  const moveDownText = result.moveDown.includes("  ")
    ? "This already sits low across the dimensions. Moving down would mean reducing scope, complexity, or autonomy further than this role typically does."
    : result.moveDown;

  const boundaryText = result.boundary
    ? `Sitting close to the ${result.boundary} boundary.`
    : "This sits comfortably inside the band.";

  return (
    <div className="p-5 md:p-6">
      {/* Level code + name */}
      <p
        className="text-xs font-medium uppercase tracking-[0.28em]"
        style={{ color: "var(--accent)" }}
      >
        Recommended level
      </p>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 outline-none"
      >
        <span
          className="mono text-5xl md:text-6xl"
          style={{ color: "var(--accent)", fontWeight: 700 }}
        >
          {result.levelCode}
        </span>
        <span
          className="text-3xl tracking-tight md:text-4xl"
          style={{ color: "var(--text)", fontWeight: 700 }}
        >
          {result.levelName}
        </span>
      </h2>

      {/* Confidence + Boundary meta row */}
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <ConfidenceBadge confidence={result.confidence} />
        <div className="text-sm">
          <p>
            <span style={{ color: "var(--text)" }}>{boundaryText}</span>
          </p>
          {result.boundary ? (
            <p
              className="mt-1 text-xs italic"
              style={{ color: "var(--text-muted)" }}
            >
              That means small evidence shifts could move the level. Worth a
              calibration check.
            </p>
          ) : null}
        </div>
      </div>

      {/* Math meta row: roleType, weighted score, core average, std deviation */}
      <dl
        className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        <div className="flex gap-1.5">
          <dt>Role type:</dt>
          <dd style={{ color: "var(--text)" }}>{roleTypeLabel(roleType)}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt>Weighted score:</dt>
          <dd className="mono" style={{ color: "var(--text)" }}>
            {result.weightedScore}
          </dd>
        </div>
        <div className="flex gap-1.5">
          <dt>Core average:</dt>
          <dd className="mono" style={{ color: "var(--text)" }}>
            {result.coreAverage}
          </dd>
        </div>
        <div className="flex gap-1.5">
          <dt>Score spread:</dt>
          <dd className="mono" style={{ color: "var(--text)" }}>
            {result.standardDeviation}
          </dd>
        </div>
      </dl>

      <Divider />

      {/* Why this level */}
      <ResultSection title="Why this level">
        <p className="leading-7" style={{ color: "var(--muted)" }}>
          {result.explanation}
        </p>
      </ResultSection>

      <Divider />

      {/* Move up / down */}
      <ResultSection title="What would move it up">
        <p className="leading-7" style={{ color: "var(--muted)" }}>
          {moveUpText}
        </p>
      </ResultSection>
      <div className="mt-5">
        <ResultSection title="What would move it down">
          <p className="leading-7" style={{ color: "var(--muted)" }}>
            {moveDownText}
          </p>
        </ResultSection>
      </div>

      <Divider />

      {/* Watch-outs */}
      <ResultSection title="Watch-outs">
        {result.flags.length ? (
          <ul className="grid gap-2">
            {result.flags.map((flag) => (
              <li
                key={flag}
                className="flex items-start gap-3 text-sm leading-6"
              >
                <span
                  className="mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide"
                  style={{
                    background: "var(--amber-bg)",
                    borderColor: "var(--amber-border)",
                    color: "var(--amber)",
                  }}
                >
                  Watch
                </span>
                <span style={{ color: "var(--muted)" }}>{flag}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="leading-7" style={{ color: "var(--muted)" }}>
            No inconsistencies in the inputs. The dimensions agree with each
            other.
          </p>
        )}
      </ResultSection>

      <Divider />

      {/* Questions HR will likely ask */}
      <ResultSection title="Questions HR will likely ask">
        <ul className="grid gap-2">
          {buildHrQuestions(result).map((question) => (
            <li
              key={question}
              className="flex items-start gap-3 text-sm leading-6"
            >
              <span
                aria-hidden="true"
                className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              <span style={{ color: "var(--muted)" }}>{question}</span>
            </li>
          ))}
        </ul>
      </ResultSection>

      <Divider />

      {/* Calibration prompt */}
      <ResultSection title="Take this into the calibration session">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <p
            className="leading-7 md:max-w-3xl"
            style={{ color: "var(--muted)" }}
          >
            {result.calibrationPrompt}
          </p>
          <button
            type="button"
            onClick={copyCalibration}
            aria-label="Copy calibration prompt"
            className="self-start rounded-full border px-3 py-1.5 text-xs font-semibold"
            style={{
              borderColor: "var(--line)",
              color: "var(--text)",
              background: "var(--surface-alt)",
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </ResultSection>

      <Divider />

      {/* Dimension scores */}
      <ResultSection title="Dimension scores">
        <div className="grid gap-2">
          {orderedRows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[110px_1fr_32px] items-center gap-3 text-sm"
            >
              <span>{row.label}</span>
              <span
                aria-hidden="true"
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
              <span
                className="mono text-right"
                aria-label={`Score ${row.score} out of 7`}
              >
                {row.score}
              </span>
            </div>
          ))}
        </div>
      </ResultSection>

      <Divider />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={downloadSummary}
          className="rounded-full border px-4 py-2 text-sm font-semibold"
          style={{
            borderColor: "var(--accent)",
            background: "var(--accent-soft)",
            color: "var(--text)",
          }}
        >
          Download summary
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

      <p
        className="mt-6 text-sm italic"
        style={{ color: "var(--text-muted)" }}
      >
        Directional guidance. Use it alongside calibration and licensed market
        data.
      </p>
    </div>
  );
}

function ConfidenceBadge({
  confidence,
}: {
  confidence: LevelingResult["confidence"];
}) {
  const config: Record<
    LevelingResult["confidence"],
    { label: string; bg: string; border: string; color: string }
  > = {
    High: {
      label: "High confidence.",
      bg: "var(--green-bg)",
      border: "var(--green-border)",
      color: "var(--green)",
    },
    Medium: {
      label: "Medium confidence.",
      bg: "var(--amber-bg)",
      border: "var(--amber-border)",
      color: "var(--amber)",
    },
    Low: {
      label: "Low confidence.",
      bg: "var(--red-bg)",
      border: "var(--red-border)",
      color: "var(--red)",
    },
  };
  const c = config[confidence];
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
      style={{
        background: c.bg,
        borderColor: c.border,
        color: c.color,
      }}
    >
      <span
        aria-hidden="true"
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: c.color }}
      />
      {c.label}
    </span>
  );
}

function ResultSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">
        {title}
      </h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function Divider() {
  return (
    <div
      aria-hidden="true"
      className="mt-6 h-px"
      style={{ background: "var(--line)" }}
    />
  );
}

/**
 * Generate the "Questions HR will likely ask" coaching list. Two baseline
 * questions always render; conditional ones come from the result shape so
 * the user is prepared for the specific places a committee will probe.
 *
 * Order: baseline → boundary → confidence → flag → track-specific.
 */
function buildHrQuestions(result: LevelingResult): string[] {
  const questions: string[] = [
    "Can you describe the role without naming the person currently in it?",
    "What two reference roles did you compare this against, one clearly below this level and one clearly above?",
  ];

  if (result.boundary) {
    const [lower, higher] = result.boundary.split("/");
    questions.push(
      `What evidence would push this from ${lower} into ${higher}?`,
    );
  }

  if (result.confidence === "Low") {
    questions.push(
      "Which two dimensions disagree the most, and what's the story behind that gap?",
    );
  } else if (result.confidence === "Medium") {
    questions.push(
      "Where is the score spread the widest, and is that a real feature of the role?",
    );
  } else {
    questions.push(
      "If you're highly confident in this read, what's the one piece of evidence a skeptic would push back on?",
    );
  }

  if (result.flags.length > 0) {
    questions.push(
      "Which of the flagged inconsistencies would change the level if it turns out you're wrong about it?",
    );
  }

  const scoreOf = (id: DimensionId): number =>
    result.dimensionRows.find((row) => row.id === id)?.score ?? 7;

  // Track-specific. Every track gets one question; the trigger picks the
  // wording that fits the result.
  if (result.roleType === "ic") {
    questions.push(
      "Where would this role plateau, and what's the path that unsticks it?",
    );
  } else if (result.roleType === "manager") {
    if (scoreOf("peopleLeadership") <= 3) {
      questions.push(
        "Is this a manager role with real ownership of people outcomes, or a senior IC who coordinates work?",
      );
    } else {
      questions.push(
        "What does success look like for the team six months out under this role's ownership?",
      );
    }
  } else if (result.roleType === "executive") {
    if (scoreOf("strategyOwnership") <= 3) {
      questions.push(
        "What strategy does this role own end-to-end, versus contribute to?",
      );
    } else {
      questions.push(
        "What's the early signal this strategy is going off track, and how does the role catch it?",
      );
    }
  }

  return questions;
}
