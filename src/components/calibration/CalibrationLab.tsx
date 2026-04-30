"use client";

import { useState } from "react";
import { scenarios } from "@/data/scenarios";

export default function CalibrationLab() {
  const [activeId, setActiveId] = useState(scenarios[0].id);
  const active = scenarios.find((scenario) => scenario.id === activeId) ?? scenarios[0];

  return (
    <section aria-labelledby="calibration-title">
      <div>
        <p
          className="text-xs font-medium uppercase tracking-[0.32em]"
          style={{ color: "var(--accent)" }}
        >
          Calibration lab
        </p>
        <h1
          id="calibration-title"
          className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
        >
          Practice the conversation before the real committee.
        </h1>
        <p className="mt-5 max-w-3xl leading-7" style={{ color: "var(--muted)" }}>
          These cases help managers separate job size from performance, tenure,
          retention pressure, and title preference. Use them as facilitation
          prompts for HRBP enablement or leadership team education.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="grid gap-3">
          {scenarios.map((scenario) => {
            const selected = scenario.id === activeId;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setActiveId(scenario.id)}
                aria-pressed={selected}
                className="rounded-[8px] border p-4 text-left"
                style={{
                  borderColor: selected ? "var(--accent)" : "var(--line)",
                  background: selected ? "var(--accent-soft)" : "var(--surface)",
                }}
              >
                <span
                  className="text-xs font-medium uppercase tracking-[0.22em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {scenario.track} - {scenario.family}
                </span>
                <span className="mt-2 block font-semibold">{scenario.title}</span>
              </button>
            );
          })}
        </div>

        <article
          className="rounded-[var(--radius-card)] border p-6"
          style={{
            borderColor: "var(--line)",
            background: "var(--surface)",
          }}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p
                className="text-xs font-medium uppercase tracking-[0.24em]"
                style={{ color: "var(--accent)" }}
              >
                {active.track} case
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                {active.title}
              </h2>
            </div>
            <p
              className="rounded-full border px-3 py-1 text-sm font-semibold"
              style={{
                borderColor: "var(--line)",
                color: "var(--text-secondary)",
              }}
            >
              {active.recommendedBand}
            </p>
          </div>

          <CaseList title="Facts to level" items={active.facts} />
          <CaseList title="Strongest evidence" items={active.strongestEvidence} />
          <CaseList title="Watch-outs" items={active.watchOuts} />

          <div
            className="mt-6 rounded-[8px] border p-4"
            style={{
              borderColor: "var(--accent)",
              background: "var(--accent-soft)",
            }}
          >
            <p className="text-sm font-semibold">Calibration question</p>
            <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
              {active.calibrationQuestion}
            </p>
          </div>
        </article>
      </div>

      <section className="mt-10" aria-labelledby="agenda-title">
        <h2 id="agenda-title" className="text-2xl font-semibold tracking-tight">
          A simple calibration agenda
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {[
            ["1", "Confirm job facts", "Scope, customers, budget, team, decision rights."],
            ["2", "Score dimensions", "Use evidence, not title expectations."],
            ["3", "Compare peers", "Name one role below and one role above."],
            ["4", "Document rationale", "Capture why the role landed where it did."],
          ].map(([step, title, body]) => (
            <article
              key={step}
              className="rounded-[var(--radius-card)] border p-4"
              style={{
                borderColor: "var(--line)",
                background: "var(--surface)",
              }}
            >
              <p className="mono text-sm" style={{ color: "var(--accent)" }}>
                {step}
              </p>
              <h3 className="mt-2 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
                {body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function CaseList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-6">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-3 grid gap-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </section>
  );
}
