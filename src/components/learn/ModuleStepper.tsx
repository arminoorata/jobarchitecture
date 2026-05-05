"use client";

import { useEffect, useRef, useState } from "react";
import type { Block, LearnModule, WidgetId } from "@/data/modules";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Paragraph } from "./blocks/Paragraph";
import { Callout } from "./blocks/Callout";
import { Table } from "./blocks/Table";
import { WorkedExample } from "./blocks/WorkedExample";
import { QuestionsCard } from "./blocks/QuestionsCard";
import { Quiz } from "./Quiz";
import { ArchitectureLadder } from "./widgets/ArchitectureLadder";
import { DimensionTryOut } from "./widgets/DimensionTryOut";
import { TrackComparator } from "./widgets/TrackComparator";
import { TitleVsLevelInsight } from "./widgets/TitleVsLevelInsight";
import { CalibrationCompare } from "./widgets/CalibrationCompare";
import { RangeOverlapVisualizer } from "./widgets/RangeOverlapVisualizer";

type WidgetComponent = (props: Record<string, unknown>) => React.ReactNode;

const WIDGET_REGISTRY: Partial<Record<WidgetId, WidgetComponent>> = {
  ArchitectureLadder: (props) => (
    <ArchitectureLadder {...(props as Parameters<typeof ArchitectureLadder>[0])} />
  ),
  DimensionTryOut: (props) => (
    <DimensionTryOut {...(props as Parameters<typeof DimensionTryOut>[0])} />
  ),
  TrackComparator: (props) => (
    <TrackComparator {...(props as Parameters<typeof TrackComparator>[0])} />
  ),
  TitleVsLevelInsight: (props) => (
    <TitleVsLevelInsight {...(props as Parameters<typeof TitleVsLevelInsight>[0])} />
  ),
  CalibrationCompare: (props) => (
    <CalibrationCompare {...(props as Parameters<typeof CalibrationCompare>[0])} />
  ),
  RangeOverlapVisualizer: (props) => (
    <RangeOverlapVisualizer {...(props as Parameters<typeof RangeOverlapVisualizer>[0])} />
  ),
};

/**
 * Step-based module experience. Replaces the prior article-style render that
 * stacked every section on one long page. The reader moves through one
 * section at a time:
 *
 *   step heading
 *   optional one-sentence takeaway (italic, accent-tinted)
 *   the section's blocks (paragraphs, widgets, tables, worked examples,
 *     callouts, quizzes)
 *   Back / Next / Restart controls and a clickable dot rail
 *
 * Every section is mounted on first render; non-active sections are hidden
 * via the `hidden` attribute. That preserves quiz answers and widget state
 * across Back/Next so a reader who steps back doesn't lose their place. A
 * stable visually-hidden status node announces the new step to assistive
 * tech, and focus moves to the active step's heading after navigation.
 */
export function ModuleStepper({ module }: { module: LearnModule }) {
  const sections = module.sections;
  const total = sections.length;
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const safeIndex = Math.min(Math.max(index, 0), Math.max(total - 1, 0));
  const section = sections[safeIndex];

  const headingRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const skipFocusRef = useRef(true);

  // Move focus to the active step's heading after the user navigates.
  // Skip the first render so the page doesn't yank focus on initial load.
  useEffect(() => {
    if (skipFocusRef.current) {
      skipFocusRef.current = false;
      return;
    }
    headingRefs.current[safeIndex]?.focus();
  }, [safeIndex]);

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(total - 1, i + 1));
  const restart = () => setIndex(0);

  const isFirst = safeIndex === 0;
  const isLast = safeIndex === total - 1;
  const progressPct = ((safeIndex + 1) / total) * 100;

  return (
    <div>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Step {safeIndex + 1} of {total}. {section.heading}.
      </p>

      <div className="mb-6">
        <div className="flex items-center justify-between gap-3">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--text-muted)" }}
          >
            Step <span className="font-mono">{safeIndex + 1}</span> of{" "}
            <span className="font-mono">{total}</span>
          </p>
          <button
            type="button"
            onClick={restart}
            disabled={isFirst}
            className="rounded text-[11px] uppercase tracking-[0.18em] underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
            style={{ color: "var(--text-muted)" }}
            aria-label="Restart at step 1"
          >
            Restart
          </button>
        </div>
        <div
          className="mt-3 h-1 w-full overflow-hidden rounded-full"
          style={{ background: "var(--line)" }}
          aria-hidden="true"
        >
          <div
            className="h-full"
            style={{
              width: `${progressPct}%`,
              background: "var(--accent)",
              transition: prefersReducedMotion
                ? "none"
                : "width 280ms ease-out",
            }}
          />
        </div>
        <ol
          className="mt-3 flex flex-wrap items-center gap-1"
          aria-label="Module steps"
        >
          {sections.map((s, i) => {
            const active = i === safeIndex;
            const visited = i < safeIndex;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  aria-current={active ? "step" : undefined}
                  aria-label={`Go to step ${i + 1}: ${s.heading}`}
                  onClick={() => setIndex(i)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex h-3 w-3 items-center justify-center rounded-full border"
                    style={{
                      background: active
                        ? "var(--accent)"
                        : visited
                          ? "var(--accent-soft)"
                          : "transparent",
                      borderColor: active
                        ? "var(--accent)"
                        : visited
                          ? "var(--accent-soft)"
                          : "var(--line)",
                    }}
                  />
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {sections.map((s, i) => {
        const active = i === safeIndex;
        return (
          <section
            key={s.id}
            hidden={!active}
            aria-labelledby={s.id}
            className="space-y-5"
          >
            <h2
              id={s.id}
              ref={(el) => {
                headingRefs.current[i] = el;
              }}
              tabIndex={-1}
              className="scroll-mt-20 text-2xl font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:text-3xl"
            >
              {s.heading}
            </h2>
            {s.takeaway && (
              <p
                className="rounded-[var(--radius-card)] border-l-2 px-4 py-2 text-base leading-7"
                style={{
                  borderLeftColor: "var(--accent)",
                  background: "var(--accent-soft)",
                  color: "var(--text)",
                }}
              >
                {s.takeaway}
              </p>
            )}
            <div className="space-y-5">
              {s.blocks.map((block, j) => (
                <BlockSwitch key={j} block={block} />
              ))}
            </div>
          </section>
        );
      })}

      <nav
        aria-label="Step navigation"
        className="mt-10 flex items-center justify-between gap-3 border-t pt-6"
        style={{ borderColor: "var(--line)" }}
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={isFirst}
          className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--line)]"
          style={{
            borderColor: "var(--line)",
            background: "var(--surface)",
            color: "var(--text)",
          }}
        >
          <span aria-hidden="true">←</span>
          <span>Back</span>
        </button>
        <p
          className="hidden text-[11px] uppercase tracking-[0.18em] md:block"
          style={{ color: "var(--text-muted)" }}
        >
          {section.heading}
        </p>
        <button
          type="button"
          onClick={goNext}
          disabled={isLast}
          className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            borderColor: isLast ? "var(--line)" : "var(--accent)",
            background: isLast ? "var(--surface)" : "var(--accent-soft)",
            color: isLast ? "var(--text-muted)" : "var(--text)",
          }}
        >
          <span>{isLast ? "End of module" : "Next"}</span>
          {!isLast && <span aria-hidden="true">→</span>}
        </button>
      </nav>
    </div>
  );
}

export default ModuleStepper;

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
        <Table
          caption={block.caption}
          headers={block.headers}
          rows={block.rows}
        />
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
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}
