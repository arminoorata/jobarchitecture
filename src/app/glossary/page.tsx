import type { Metadata } from "next";
import { glossaryTerms } from "@/data/architecture";
import { GlossaryList } from "@/components/glossary/GlossaryList";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Glossary",
  description: "Plain-language definitions for the words this toolkit uses.",
});

export default function GlossaryPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
      <section>
        <p
          className="text-xs font-medium uppercase tracking-[0.32em]"
          style={{ color: "var(--accent)" }}
        >
          Glossary
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Plain-language definitions for the words this tool throws around.
        </h1>
        <p
          className="mt-5 max-w-3xl leading-7"
          style={{ color: "var(--muted)" }}
        >
          If something in a module is fuzzy, this is the page for it. Most of
          these terms get used differently across companies. The definitions
          here are the ones the tool uses.
        </p>
      </section>

      <GlossaryList terms={glossaryTerms} />
    </main>
  );
}
