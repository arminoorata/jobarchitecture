"use client";

import { useState } from "react";
import { architectureLayers } from "@/data/architecture";

export default function ArchitectureExplorer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = architectureLayers[activeIndex];

  return (
    <section aria-labelledby="architecture-explorer-title">
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p
            className="text-xs font-medium uppercase tracking-[0.32em]"
            style={{ color: "var(--accent)" }}
          >
            Manager mental model
          </p>
          <h1
            id="architecture-explorer-title"
            className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
          >
            Think in architecture before you think in titles.
          </h1>
          <p
            className="mt-5 max-w-2xl text-base leading-7"
            style={{ color: "var(--muted)" }}
          >
            Use the stack below to place a role in context. It mirrors the
            public job architecture language Aon uses around functions,
            families, career levels, titles, and market data, while keeping
            the rubrics here original and non-proprietary.
          </p>
        </div>

        <div
          className="rounded-[var(--radius-card)] border p-5 md:p-6"
          style={{
            borderColor: "var(--line)",
            background: "var(--surface)",
          }}
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {architectureLayers.map((layer, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={layer.label}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={selected}
                  className="rounded-[8px] border p-4 text-left transition-colors"
                  style={{
                    borderColor: selected ? "var(--accent)" : "var(--line)",
                    background: selected
                      ? "var(--accent-soft)"
                      : "var(--surface-alt)",
                  }}
                >
                  <span
                    className="block text-xs font-medium uppercase tracking-[0.18em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Step {index + 1}
                  </span>
                  <span className="mt-1 block text-base font-semibold">
                    {layer.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 border-t pt-5" style={{ borderColor: "var(--line)" }}>
            <p className="text-2xl font-semibold tracking-tight">
              {active.label}
            </p>
            <p
              className="mt-2 text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              Example: {active.example}
            </p>
            <p className="mt-4 leading-7" style={{ color: "var(--muted)" }}>
              {active.explanation}
            </p>
            <p
              className="mt-5 rounded-[8px] border p-4 text-sm leading-6"
              style={{
                borderColor: "var(--line)",
                background: "var(--bg-alt)",
                color: "var(--text-secondary)",
              }}
            >
              <span className="font-semibold" style={{ color: "var(--text)" }}>
                Manager question:
              </span>{" "}
              {active.managerQuestion}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
