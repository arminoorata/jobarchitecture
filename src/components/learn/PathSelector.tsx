"use client";

import { learningPaths, type LearningPathId } from "@/data/learning-paths";

type Props = {
  value: LearningPathId | null;
  onChange: (id: LearningPathId | null) => void;
};

/**
 * Controlled path selector. Renders a fieldset of situation-based options
 * plus a clear button. Page-level state owns the value; this component is
 * purely presentational and only emits change events.
 *
 * Situations come from the autonomous-execution brief: pick the task you
 * showed up to do, and the module grid leads with what helps that task.
 */
export function PathSelector({ value, onChange }: Props) {
  return (
    <fieldset className="rounded-[var(--radius-card)] border p-5 md:p-6"
      style={{
        borderColor: "var(--line)",
        background: "var(--surface)",
      }}
    >
      <legend className="px-2 text-sm font-semibold">
        What are you here to do?
      </legend>
      <p
        className="mt-1 px-2 text-sm leading-6"
        style={{ color: "var(--muted)" }}
      >
        Pick the task that fits. Modules below reorder so the most useful one
        for that task reads first. Skip this if you&apos;d rather read in order.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {learningPaths.map((path) => {
          const selected = value === path.id;
          return (
            <label
              key={path.id}
              className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-card)] border p-4 transition-colors focus-within:ring-2 focus-within:ring-[var(--accent)]"
              style={{
                borderColor: selected ? "var(--accent)" : "var(--line)",
                background: selected ? "var(--accent-soft)" : "var(--surface-alt)",
                minHeight: "44px",
              }}
            >
              <input
                type="radio"
                name="learning-path"
                value={path.id}
                checked={selected}
                onChange={() => onChange(path.id)}
                className="mt-1 h-4 w-4 cursor-pointer"
                style={{ accentColor: "var(--accent)" }}
              />
              <span className="flex flex-col gap-1">
                <span
                  className={`text-sm leading-6 ${selected ? "font-semibold" : "font-medium"}`}
                  style={{ color: "var(--text)" }}
                >
                  {path.label}
                </span>
                <span
                  className="text-xs leading-5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {path.blurb}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => onChange(null)}
          disabled={value === null}
          className="rounded text-sm underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60 disabled:no-underline"
          style={{ color: "var(--text-muted)" }}
        >
          Clear selection
        </button>
      </div>
    </fieldset>
  );
}

export default PathSelector;
