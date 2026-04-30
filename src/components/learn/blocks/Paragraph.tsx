"use client";

import { Fragment, useId, useState } from "react";
import { glossaryTerms, sourceNotes } from "@/data/architecture";
import { splitByGlossaryTerms, termSlug } from "@/lib/glossary";

type Props = {
  text: string;
};

/**
 * Render a paragraph with two pieces of inline machinery:
 *
 * 1. Auto glossary linking. Any whole-word match against `glossaryTerms[].term`
 *    becomes a button with a dotted underline. Hover or focus opens a small
 *    popover with the plain definition and a "More" link to /glossary#<slug>.
 *    Source: spec §5.5.
 *
 * 2. Source-note inline markers. References shaped like `(see [src/aon-architecture])`
 *    render as superscript footnote numbers that link to `/methodology#sources`.
 *    Multiple ids inside one parenthetical are supported. Source: spec §5.4.
 *
 * Tooltip state is local. We open on hover and on keyboard focus. We close on
 * blur, mouse leave, and Escape so it stays keyboard friendly.
 */
export function Paragraph({ text }: Props) {
  // Step 1: extract source-note groups so we can render them as footnotes.
  // We split the text into runs of plain prose separated by source-note groups.
  const sourceParts: Array<
    { kind: "prose"; value: string } | { kind: "sources"; ids: string[] }
  > = [];
  const sourcePattern = /\s*\(see\s+((?:\[src\/[^\]]+\](?:\s+and\s+|\s*,\s*)?)+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = sourcePattern.exec(text)) !== null) {
    if (m.index > last) {
      sourceParts.push({ kind: "prose", value: text.slice(last, m.index) });
    }
    const idMatches = [...m[1].matchAll(/\[src\/([^\]]+)\]/g)].map((x) => x[1]);
    sourceParts.push({ kind: "sources", ids: idMatches });
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    sourceParts.push({ kind: "prose", value: text.slice(last) });
  }
  if (sourceParts.length === 0) {
    sourceParts.push({ kind: "prose", value: text });
  }

  return (
    <p
      className="leading-7"
      style={{ color: "var(--text)" }}
    >
      {sourceParts.map((part, i) => {
        if (part.kind === "sources") {
          return (
            <Fragment key={`s-${i}`}>
              {part.ids.map((id, j) => {
                const number = sourceNumberFor(id);
                if (number === null) {
                  // Unknown source id: render visibly so authors notice
                  // the broken reference instead of silently mis-numbering.
                  return (
                    <sup
                      key={`${id}-${j}`}
                      className="ml-0.5"
                      style={{ color: "var(--red)" }}
                      title={`Unknown source id: ${id}`}
                    >
                      [?{id}]
                    </sup>
                  );
                }
                const anchor = sourceAnchorFor(id) ?? "sources";
                return (
                  <sup key={`${id}-${j}`} className="ml-0.5">
                    <a
                      href={`/methodology#${anchor}`}
                      className="font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ color: "var(--accent)", outlineColor: "var(--accent)" }}
                      aria-label={`Source ${number}: ${id}`}
                    >
                      [{number}]
                    </a>
                  </sup>
                );
              })}
            </Fragment>
          );
        }
        // Plain prose run gets glossary linking.
        return (
          <Fragment key={`p-${i}`}>
            <ProseWithGlossary text={part.value} />
          </Fragment>
        );
      })}
    </p>
  );
}

// Inline marker ids used in module copy resolve to a `sourceNotes` entry in
// this priority order:
//   1. Exact match against `sourceNote.id` (the canonical slug field).
//   2. Substring alias on `label` (legacy — kept for older marker ids).
//   3. Two-way slug containment on `label` (last-resort fallback).
// Whenever you add a new source, set its `id` field. Whenever you reference
// a source from module copy, use that same id verbatim.
const SOURCE_ID_ALIASES: Record<string, string> = {
  "aon-architecture": "aon job architecture",
  "rmcd-features": "reporting features",
  "rmcd-job-offers": "job offers data",
  "aon-comp-101": "compensation 101",
};

/**
 * Returns the anchor id (e.g. `sources-aon-architecture`) for a given marker id
 * by resolving it to a `sourceNote` and reading that note's `id` field.
 */
function sourceAnchorFor(markerId: string): string | null {
  const number = sourceNumberFor(markerId);
  if (number === null) return null;
  const note = sourceNotes[number - 1];
  if (note?.id) return `sources-${note.id}`;
  return null;
}

function sourceNumberFor(id: string): number | null {
  // Step 1: exact id match (preferred, since Phase 8 added `id` to SourceNote).
  const directIdx = sourceNotes.findIndex((n) => n.id === id);
  if (directIdx >= 0) return directIdx + 1;

  // Step 2: legacy alias substring on label.
  const lookup = SOURCE_ID_ALIASES[id];
  if (lookup) {
    const idx = sourceNotes.findIndex((n) =>
      n.label.toLowerCase().includes(lookup),
    );
    if (idx >= 0) return idx + 1;
  }
  // Step 3: slug containment in either direction so an exact label
  // match still resolves without an alias entry.
  const slugOf = (s: string) =>
    s
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const target = slugOf(id);
  const idx = sourceNotes.findIndex((n) => {
    const labelSlug = slugOf(n.label);
    return labelSlug.includes(target) || target.includes(labelSlug);
  });
  return idx >= 0 ? idx + 1 : null;
}

function ProseWithGlossary({ text }: { text: string }) {
  const segments = splitByGlossaryTerms(text, glossaryTerms);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.kind === "text") {
          return <Fragment key={i}>{seg.value}</Fragment>;
        }
        return <GlossaryToken key={i} value={seg.value} term={seg.term} />;
      })}
    </>
  );
}

function GlossaryToken({
  value,
  term,
}: {
  value: string;
  term: { term: string; plain: string };
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const tipId = `${id}-tip`;
  const slug = termSlug(term.term);
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        // Keep the tooltip open if focus moves to the "More" link inside
        // the popover. Close it only when focus leaves the wrapper.
        const next = e.relatedTarget as Node | null;
        if (!next || !e.currentTarget.contains(next)) {
          setOpen(false);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-describedby={open ? tipId : undefined}
        aria-expanded={open}
        className="cursor-help underline decoration-dotted underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          color: "inherit",
          textDecorationColor: "var(--accent)",
          background: "transparent",
          outlineColor: "var(--accent)",
        }}
      >
        {value}
      </button>
      {open ? (
        // No top-margin gap on purpose: the popover sits flush against the
        // trigger so the cursor can travel down to the "More" link without
        // leaving the hover wrapper and closing the popover.
        <span
          id={tipId}
          className="absolute left-0 top-full z-30 w-72 rounded-[var(--radius-card)] border p-3 text-sm leading-6 shadow-md"
          style={{
            background: "var(--tooltip-bg)",
            borderColor: "var(--line)",
            color: "var(--text)",
          }}
        >
          <span className="block font-semibold" style={{ color: "var(--accent)" }}>
            {term.term}
          </span>
          <span className="mt-1 block">{term.plain}</span>
          <a
            href={`/glossary#${slug}`}
            className="mt-2 inline-block text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: "var(--accent)", outlineColor: "var(--accent)" }}
          >
            More in the glossary
          </a>
        </span>
      ) : null}
    </span>
  );
}
