import type { LearnModule } from "@/data/modules";
import { QuestionsCard } from "./blocks/QuestionsCard";
import { AnchorRolePicker } from "./widgets/AnchorRolePicker";
import { ModuleStepper } from "./ModuleStepper";

// AnchorRolePicker is interactive-only (it requires `value` + `onChange`),
// so it's not used as a static block widget. Modules don't reference it; the
// home Architecture Explorer uses it directly with state.
export { AnchorRolePicker };

type Props = {
  module: LearnModule;
};

/**
 * Server component shell around `ModuleStepper`. Renders the header
 * (icon, minutes, title, audience, blurb) and footer (questions, last
 * reviewed) statically for SEO, and delegates the section walk-through
 * to the client stepper.
 */
export function ModuleRenderer({ module }: Props) {
  return (
    <article className="mx-auto max-w-[720px] py-6 md:py-10">
      <header className="border-b pb-6" style={{ borderColor: "var(--line)" }}>
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="text-3xl">
            {module.icon}
          </span>
          <p
            className="text-xs font-medium uppercase tracking-[0.28em]"
            style={{ color: "var(--accent)" }}
          >
            {module.minutes} min read
          </p>
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          {module.title}
        </h1>
        <p
          className="mt-3 text-sm font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          For: {module.audience}
        </p>
        <p className="mt-4 leading-7" style={{ color: "var(--muted)" }}>
          {module.blurb}
        </p>
      </header>

      <div className="mt-8">
        <ModuleStepper module={module} />
      </div>

      <footer
        className="mt-12 border-t pt-6"
        style={{ borderColor: "var(--line)" }}
      >
        <QuestionsCard items={module.questions} />
        <p
          className="mt-4 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          Last reviewed: {module.lastReviewed}
        </p>
      </footer>
    </article>
  );
}
