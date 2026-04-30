"use client";

import { useId, useMemo, useState } from "react";
import type { GlossaryTerm } from "@/data/architecture";
import { GlossaryEntry } from "./GlossaryEntry";

type Props = {
  terms: GlossaryTerm[];
};

/**
 * Search + alphabetical term list.
 *
 * Live filter is case-insensitive across `term`, `plain`, and `useWhen`.
 * Empty state announces via `aria-live="polite"` so screen readers catch the
 * zero-match case. Search state lives only in memory; we don't persist it to
 * URL or localStorage to keep the page cheap and shareable as-is.
 */
export function GlossaryList({ terms }: Props) {
  const [query, setQuery] = useState("");
  const inputId = useId();

  const sorted = useMemo(
    () => [...terms].sort((a, b) => a.term.localeCompare(b.term)),
    [terms],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((t) =>
      [t.term, t.plain, t.useWhen]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [sorted, query]);

  const isEmpty = filtered.length === 0;

  return (
    <div className="mt-10">
      <div
        className="rounded-[var(--radius-card)] border p-4"
        style={{
          borderColor: "var(--line)",
          background: "var(--surface-alt)",
        }}
      >
        <label
          htmlFor={inputId}
          className="block text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: "var(--muted)" }}
        >
          Search
        </label>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the glossary."
          autoComplete="off"
          className="mt-2 w-full rounded-[var(--radius-card)] border bg-transparent px-3 py-2 text-base leading-6 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            borderColor: "var(--line)",
            color: "var(--text)",
            outlineColor: "var(--accent)",
          }}
        />
      </div>

      <div
        className="mt-6"
        aria-live="polite"
        aria-label="Glossary results"
      >
        {isEmpty ? (
          <div
            className="rounded-[var(--radius-card)] border p-6 text-sm"
            style={{
              borderColor: "var(--line)",
              background: "var(--surface)",
              color: "var(--muted)",
            }}
          >
            <p>No matches. Try fewer letters.</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-3 inline-block rounded text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                color: "var(--accent)",
                outlineColor: "var(--accent)",
              }}
            >
              Clear search
            </button>
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {filtered.map((t) => (
              <li key={t.term}>
                <GlossaryEntry term={t} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
