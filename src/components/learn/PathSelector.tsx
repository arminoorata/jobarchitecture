"use client";

import { learningPaths, type LearningPathId } from "@/data/learning-paths";

type Props = {
  value: LearningPathId | null;
  onChange: (id: LearningPathId | null) => void;
};

/**
 * Controlled path selector. Renders a fieldset of four radio options plus a
 * reset button. Page-level state owns the value; this component is purely
 * presentational and only emits change events.
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
        What brings you here today?
      </legend>

      <div className="mt-2 grid gap-3 md:grid-cols-4">
        {learningPaths.map((path) => {
          const selected = value === path.id;
          return (
            <label
              key={path.id}
              className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-card)] border p-4 transition-colors focus-within:ring-2 focus-within:ring-[var(--accent)]"
              style={{
                borderColor: selected ? "var(--accent)" : "var(--line)",
                background: selected ? "var(--accent-soft)" : "var(--surface-alt)",
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
              <span
                className={`text-sm leading-6 ${selected ? "font-semibold" : "font-medium"}`}
                style={{ color: "var(--text)" }}
              >
                {path.label}
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
          Show all five in the default order.
        </button>
      </div>
    </fieldset>
  );
}

export default PathSelector;
