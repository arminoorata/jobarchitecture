import type { GlossaryTerm } from "@/data/architecture";

/**
 * A single segment of prose after splitting by glossary terms.
 *
 * - `kind: "text"` is a literal run of characters with no glossary linking.
 * - `kind: "term"` is a whole-word match against `GlossaryTerm.term`. The
 *   `value` field preserves the original casing from the source string so the
 *   renderer can show the prose as the author wrote it. The `term` field
 *   carries the matched glossary entry for tooltip data.
 *
 * Manual override: if a term in the source prose is preceded by a leading
 * backslash (for example `\Level`), the renderer skips linking and emits the
 * term as plain text with the backslash stripped.
 */
export type GlossarySegment =
  | { kind: "text"; value: string }
  | { kind: "term"; value: string; term: GlossaryTerm };

/**
 * Slugify a glossary term into a hash anchor for /glossary#<slug>.
 * Lowercase, ampersands become "and", non-alphanumerics collapse to a hyphen,
 * trim leading and trailing hyphens.
 */
export function termSlug(term: string): string {
  return term
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Split prose into a sequence of text and term segments.
 *
 * - Match is case-insensitive.
 * - Whole-word only (word boundaries on both sides; hyphens count as word
 *   boundary so "level-set" still matches "level").
 * - Longest match wins when terms overlap (so "career track" beats "track").
 * - A leading backslash on a term in the source string skips linking, e.g.
 *   `\Level` in input renders as the literal text "Level".
 */
export function splitByGlossaryTerms(
  text: string,
  terms: GlossaryTerm[],
): GlossarySegment[] {
  if (!text) return [];
  if (terms.length === 0) return [{ kind: "text", value: text }];

  // Sort terms longest first so the regex engine prefers "career track" over
  // "track" when both could match at the same position.
  const sorted = [...terms].sort((a, b) => b.term.length - a.term.length);
  const termsByLower = new Map<string, GlossaryTerm>();
  for (const t of sorted) {
    const key = t.term.toLowerCase();
    if (!termsByLower.has(key)) termsByLower.set(key, t);
  }

  // Build one alternation. Use lookarounds for whole-word matching that
  // also lets us catch the optional preceding backslash escape. We use
  // `[^A-Za-z0-9]` style boundaries so word boundaries work consistently
  // across hyphens, punctuation, and string edges.
  const alternation = sorted.map((t) => escapeRegex(t.term)).join("|");
  const pattern = new RegExp(
    `(\\\\)?(?<![A-Za-z0-9])(${alternation})(?![A-Za-z0-9])`,
    "gi",
  );

  const segments: GlossarySegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const [full, escape, matched] = match;
    const start = match.index;
    const end = start + full.length;

    if (start > lastIndex) {
      segments.push({ kind: "text", value: text.slice(lastIndex, start) });
    }

    if (escape) {
      // Backslash escape: emit the matched word as plain text, drop the slash.
      segments.push({ kind: "text", value: matched });
    } else {
      const entry = termsByLower.get(matched.toLowerCase());
      if (entry) {
        segments.push({ kind: "term", value: matched, term: entry });
      } else {
        segments.push({ kind: "text", value: matched });
      }
    }

    lastIndex = end;
  }

  if (lastIndex < text.length) {
    segments.push({ kind: "text", value: text.slice(lastIndex) });
  }

  return segments;
}
