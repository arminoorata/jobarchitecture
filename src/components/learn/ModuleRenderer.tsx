import type { Block, LearnModule, WidgetId } from "@/data/modules";
import { Paragraph } from "./blocks/Paragraph";
import { Callout } from "./blocks/Callout";
import { Table } from "./blocks/Table";
import { WorkedExample } from "./blocks/WorkedExample";
import { QuestionsCard } from "./blocks/QuestionsCard";
import { Quiz } from "./Quiz";
import { ArchitectureLadder } from "./widgets/ArchitectureLadder";
import { AnchorRolePicker } from "./widgets/AnchorRolePicker";
import { DimensionTryOut } from "./widgets/DimensionTryOut";
import { TrackComparator } from "./widgets/TrackComparator";
import { TitleVsLevelInsight } from "./widgets/TitleVsLevelInsight";
import { CalibrationCompare } from "./widgets/CalibrationCompare";
import { RangeOverlapVisualizer } from "./widgets/RangeOverlapVisualizer";

// AnchorRolePicker is interactive-only (it requires `value` + `onChange`),
// so it's not used as a static block widget. Modules don't reference it; the
// home Architecture Explorer uses it directly with state.
type WidgetComponent = (props: Record<string, unknown>) => React.ReactNode;

const WIDGET_REGISTRY: Partial<Record<WidgetId, WidgetComponent>> = {
  ArchitectureLadder: (props) => <ArchitectureLadder {...(props as Parameters<typeof ArchitectureLadder>[0])} />,
  DimensionTryOut: (props) => <DimensionTryOut {...(props as Parameters<typeof DimensionTryOut>[0])} />,
  TrackComparator: (props) => <TrackComparator {...(props as Parameters<typeof TrackComparator>[0])} />,
  TitleVsLevelInsight: (props) => <TitleVsLevelInsight {...(props as Parameters<typeof TitleVsLevelInsight>[0])} />,
  CalibrationCompare: (props) => <CalibrationCompare {...(props as Parameters<typeof CalibrationCompare>[0])} />,
  RangeOverlapVisualizer: (props) => <RangeOverlapVisualizer {...(props as Parameters<typeof RangeOverlapVisualizer>[0])} />,
};

export { AnchorRolePicker };

type Props = {
  module: LearnModule;
};

/**
 * Block-aware renderer. Walks a `LearnModule` and dispatches each block to
 * the right component. Widget blocks render a labeled placeholder card for
 * now; Phase 3 swaps them in.
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

      <div className="mt-8 space-y-10">
        {module.sections.map((section) => (
          <section key={section.id} className="space-y-5">
            <h2
              id={section.id}
              className="scroll-mt-20 text-2xl font-semibold tracking-tight"
            >
              {section.heading}
            </h2>
            <div className="space-y-5">
              {section.blocks.map((block, i) => (
                <BlockSwitch key={i} block={block} />
              ))}
            </div>
          </section>
        ))}
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

function BlockSwitch({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":
      return <Paragraph text={block.text} />;
    case "callout":
      return (
        <Callout
          severity={block.severity}
          title={block.title}
          body={block.body}
          notAdvice={block.notAdvice}
        />
      );
    case "table":
      return (
        <Table caption={block.caption} headers={block.headers} rows={block.rows} />
      );
    case "worked-example":
      return (
        <WorkedExample
          title={block.title}
          lines={block.lines}
          footnote={block.footnote}
        />
      );
    case "quiz":
      return <Quiz quizId={block.quizId} />;
    case "questions":
      return <QuestionsCard title={block.title} items={block.items} />;
    case "widget": {
      const Widget = WIDGET_REGISTRY[block.widgetId];
      if (!Widget) {
        return (
          <div
            data-widget-id={block.widgetId}
            className="rounded-[var(--radius-card)] border p-4 text-sm"
            style={{
              borderColor: "var(--line)",
              background: "var(--surface-alt)",
              color: "var(--text-muted)",
            }}
          >
            <p className="font-medium" style={{ color: "var(--text)" }}>
              {block.widgetId}
            </p>
            <p className="mt-1 text-xs">
              Widget not registered for inline rendering.
            </p>
          </div>
        );
      }
      return Widget(block.props ?? {});
    }
    default: {
      // Exhaustiveness guard. If a new block type lands in the data layer
      // and skips the renderer, TypeScript will flag it here at compile time.
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}
