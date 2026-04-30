"use client";

import { useId, useState } from "react";
import { quizzes } from "@/data/quizzes";

type Props = {
  quizId: string;
};

/**
 * Single-question multiple-choice quiz. Reads the quiz by id from
 * `data/quizzes.ts`. On pick:
 *
 * - Every option's correctness reveals (color + a "Correct" or "Not quite"
 *   label).
 * - The correct option highlights.
 * - Each option's `explanation` shows under it.
 * - The quiz's `closing` line shows below the option list.
 *
 * "Try another" resets the selection. Nothing persists.
 *
 * A11y: the question lives in a `<fieldset>` + `<legend>`. Options are
 * native radio inputs in styled labels so keyboard nav and screen readers
 * pick up the group correctly. The reveal region uses `aria-live="polite"`
 * so a screen reader announces the result without yanking focus.
 */
export function Quiz({ quizId }: Props) {
  const quiz = quizzes.find((q) => q.id === quizId);
  const [picked, setPicked] = useState<string | null>(null);
  const groupId = useId();

  if (!quiz) {
    return (
      <p
        className="text-sm italic"
        style={{ color: "var(--text-muted)" }}
      >
        Quiz {quizId} is not yet written.
      </p>
    );
  }

  const revealed = picked !== null;

  return (
    <section
      className="rounded-[var(--radius-card)] border p-5 md:p-6"
      style={{
        background: "var(--surface)",
        borderColor: "var(--line)",
      }}
    >
      <fieldset>
        <legend className="text-base font-semibold leading-7">
          {quiz.question}
        </legend>
        <div className="mt-4 space-y-3" aria-live="polite">
          {quiz.options.map((option) => {
            const isPicked = picked === option.id;
            const showState = revealed;
            const palette = optionPalette(option.correct, isPicked, showState);
            const inputId = `${groupId}-${option.id}`;
            return (
              <div key={option.id}>
                <label
                  htmlFor={inputId}
                  className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-card)] border p-3 leading-6 focus-within:outline-2 focus-within:outline-offset-2"
                  style={{
                    borderColor: palette.border,
                    background: palette.bg,
                    minHeight: 44,
                    outlineColor: "var(--accent)",
                  }}
                >
                  <input
                    id={inputId}
                    type="radio"
                    name={groupId}
                    value={option.id}
                    checked={isPicked}
                    disabled={revealed}
                    onChange={() => setPicked(option.id)}
                    className="mt-1"
                  />
                  <span className="flex-1">
                    <span className="block font-medium">{option.label}</span>
                    {showState ? (
                      <span
                        className="mt-1 block text-xs font-semibold uppercase tracking-wider"
                        style={{ color: palette.title }}
                      >
                        {option.correct ? "Correct" : "Not quite"}
                      </span>
                    ) : null}
                  </span>
                </label>
                {showState ? (
                  <p
                    className="mt-2 px-3 text-sm leading-6"
                    style={{ color: "var(--muted)" }}
                  >
                    {option.explanation}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </fieldset>

      <div aria-live="polite" className="mt-5">
        {revealed ? (
          <>
            {quiz.closing ? (
              <p
                className="rounded-[var(--radius-card)] border p-3 text-sm leading-6"
                style={{
                  borderColor: "var(--accent)",
                  background: "var(--accent-soft)",
                  color: "var(--text)",
                }}
              >
                {quiz.closing}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => setPicked(null)}
              className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-pill)] border px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: "var(--line)",
                background: "var(--button-fill)",
                color: "var(--text)",
                outlineColor: "var(--accent)",
              }}
            >
              Try it again
            </button>
          </>
        ) : null}
      </div>
    </section>
  );
}

function optionPalette(
  correct: boolean,
  picked: boolean,
  revealed: boolean,
): { bg: string; border: string; title: string } {
  if (!revealed) {
    return {
      bg: "var(--surface-alt)",
      border: picked ? "var(--accent)" : "var(--line)",
      title: "var(--text)",
    };
  }
  if (correct) {
    return {
      bg: "var(--green-bg)",
      border: "var(--green-border)",
      title: "var(--green)",
    };
  }
  if (picked) {
    return {
      bg: "var(--red-bg)",
      border: "var(--red-border)",
      title: "var(--red)",
    };
  }
  return {
    bg: "var(--surface-alt)",
    border: "var(--line)",
    title: "var(--muted)",
  };
}
