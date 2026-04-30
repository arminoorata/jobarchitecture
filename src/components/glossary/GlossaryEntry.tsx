import type { GlossaryTerm } from "@/data/architecture";
import { termSlug } from "@/lib/glossary";

type Props = {
  term: GlossaryTerm;
};

/**
 * Single glossary card. Anchored by `id={termSlug(term.term)}` so inline
 * tooltips in `Paragraph.tsx` can deep-link via `/glossary#<slug>`.
 *
 * The card is intentionally not a link. Navigation into a term comes from the
 * "More" link inside the inline tooltip; the card itself is a quiet definition
 * surface.
 */
export function GlossaryEntry({ term }: Props) {
  const slug = termSlug(term.term);
  return (
    <article
      id={slug}
      className="scroll-mt-24 rounded-[var(--radius-card)] border p-5"
      style={{
        borderColor: "var(--line)",
        background: "var(--surface)",
      }}
    >
      <h2
        className="text-xl font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-outfit, inherit)" }}
      >
        {term.term}
      </h2>
      <p
        className="mt-3 text-sm leading-6"
        style={{ color: "var(--text)" }}
      >
        {term.plain}
      </p>
      <p
        className="mt-4 border-t pt-4 text-sm leading-6"
        style={{
          borderColor: "var(--line)",
          color: "var(--muted)",
        }}
      >
        <span className="font-semibold">Use it when:</span> {term.useWhen}
      </p>
    </article>
  );
}
