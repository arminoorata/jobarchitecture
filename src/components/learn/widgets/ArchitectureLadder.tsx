"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { architectureLayers } from "@/data/architecture";
import { anchorRoles } from "@/data/anchor-roles";
import { WidgetFrame } from "./WidgetFrame";

type Props = {
  /**
   * Optional anchor role to populate each layer's example. When unset, the
   * widget shows the generic example baked into `architectureLayers`.
   */
  anchorRoleId?: string;
};

/**
 * The six-layer architecture model as a stack of expandable cards.
 *
 * Inputs: optional `anchorRoleId` to populate examples from `anchorRoles`.
 * Outputs: a vertical stack of buttons; click or Enter/Space toggles an
 * expanded panel; arrow up/down moves focus between buttons.
 *
 * Fallback: every layer rendered open with the generic example. No motion.
 */
export function ArchitectureLadder({ anchorRoleId }: Props) {
  const role = anchorRoleId
    ? anchorRoles.find((r) => r.id === anchorRoleId) ?? null
    : null;

  const rows = useMemo(() => buildRows(role), [role]);
  const genericRows = useMemo(() => buildRows(null), []);

  return (
    <WidgetFrame
      caption="The six layers"
      // Per spec §13.1, fallback shows the generic examples regardless of the
      // active anchor role, so reduced-motion users see a stable view.
      fallback={<LadderFallback rows={genericRows} />}
    >
      <InteractiveLadder rows={rows} />
    </WidgetFrame>
  );
}

type Row = {
  label: string;
  example: string;
  explanation: string;
  managerQuestion: string;
};

function buildRows(role: ReturnType<typeof anchorRoles.find> | null): Row[] {
  return architectureLayers.map((layer) => ({
    label: layer.label,
    example: exampleFor(layer.label, role) ?? layer.example,
    explanation: layer.explanation,
    managerQuestion: layer.managerQuestion,
  }));
}

function exampleFor(
  label: string,
  role: ReturnType<typeof anchorRoles.find> | null,
): string | null {
  if (!role) return null;
  switch (label) {
    case "Function":
      return role.function;
    case "Job family":
      return role.family;
    case "Career track":
      return role.track;
    case "Level":
      return role.level;
    case "Title":
      return role.titleExample;
    case "Market match":
      return role.marketMatch;
    default:
      return null;
  }
}

function InteractiveLadder({ rows }: { rows: Row[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const focusIndex = (i: number) => {
    const total = rows.length;
    const next = ((i % total) + total) % total;
    buttonRefs.current[next]?.focus();
  };

  const handleKey = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusIndex(index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusIndex(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusIndex(rows.length - 1);
    }
  };

  return (
    <ul className="space-y-2" role="list">
      {rows.map((row, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-btn-${index}`;
        const regionId = `${baseId}-region-${index}`;
        return (
          <li key={row.label}>
            <button
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={regionId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              onKeyDown={(event) => handleKey(event, index)}
              className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-card)] border px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: isOpen ? "var(--accent-soft)" : "var(--surface-alt)",
                borderColor: isOpen ? "var(--accent)" : "var(--line)",
                color: "var(--text)",
                outlineColor: "var(--accent)",
                minHeight: "44px",
              }}
            >
              <span className="flex flex-1 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-mono"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    color: "var(--accent)",
                  }}
                >
                  {index + 1}
                </span>
                <span className="flex-1">
                  <span className="font-semibold">{row.label}</span>
                  <span
                    className="ml-2 text-sm"
                    style={{ color: "var(--muted)" }}
                  >
                    {row.example}
                  </span>
                </span>
              </span>
              <Chevron open={isOpen} />
            </button>
            {isOpen ? (
              <section
                id={regionId}
                role="region"
                aria-labelledby={buttonId}
                className="mt-2 rounded-[var(--radius-card)] border px-4 py-3 text-sm leading-7"
                style={{
                  background: "var(--surface-alt)",
                  borderColor: "var(--line)",
                  color: "var(--text)",
                }}
              >
                <p>{row.explanation}</p>
                <p
                  className="mt-2 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Manager question: {row.managerQuestion}
                </p>
              </section>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function LadderFallback({ rows }: { rows: Row[] }) {
  return (
    <ul className="space-y-3" role="list">
      {rows.map((row, index) => (
        <li
          key={row.label}
          className="rounded-[var(--radius-card)] border px-4 py-3"
          style={{
            background: "var(--surface-alt)",
            borderColor: "var(--line)",
            color: "var(--text)",
          }}
        >
          <p className="text-sm">
            <span
              aria-hidden="true"
              className="mr-2 font-mono text-xs"
              style={{ color: "var(--accent)" }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-semibold">{row.label}</span>
            <span className="ml-2" style={{ color: "var(--muted)" }}>
              {row.example}
            </span>
          </p>
          <p className="mt-2 text-sm leading-6">{row.explanation}</p>
          <p
            className="mt-1 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Manager question: {row.managerQuestion}
          </p>
        </li>
      ))}
    </ul>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      style={{
        color: "var(--accent)",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 160ms ease",
      }}
    >
      <path
        d="M3.5 5.25L7 8.75L10.5 5.25"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
