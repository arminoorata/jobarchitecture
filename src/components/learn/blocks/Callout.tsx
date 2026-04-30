import { Fragment } from "react";

type Props = {
  severity: "info" | "amber" | "red" | "green";
  title?: string;
  body: string;
  notAdvice?: boolean;
};

/**
 * Severity-colored callout. Color tokens match spec §5.1.
 *
 * - info  → accent-soft background, accent border
 * - green → semantic green
 * - amber → semantic amber
 * - red   → semantic red
 *
 * The body string sometimes carries newline-delimited list-like content
 * (see modules.ts callouts). When we detect either bullet-style markers or
 * numbered prefixes we render the body as a list. Otherwise it's a paragraph.
 *
 * `notAdvice: true` adds the educational-guidance footer line.
 */
export function Callout({ severity, title, body, notAdvice }: Props) {
  const palette = paletteFor(severity);
  const lines = body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const looksLikeList =
    lines.length > 1 &&
    lines.every((l) => /^(\d+[.)]|[-*•])\s+/.test(l));

  return (
    <aside
      className="rounded-[var(--radius-card)] border p-4 md:p-5"
      style={{
        background: palette.bg,
        borderColor: palette.border,
        color: "var(--text)",
      }}
      aria-label={title ?? `${severity} callout`}
    >
      {title ? (
        <p className="font-semibold" style={{ color: palette.title }}>
          {title}
        </p>
      ) : null}
      {looksLikeList ? (
        <ul className={`${title ? "mt-2" : ""} list-disc pl-5 leading-7`}>
          {lines.map((l, i) => {
            const stripped = l.replace(/^(\d+[.)]|[-*•])\s+/, "");
            return <li key={i}>{stripped}</li>;
          })}
        </ul>
      ) : (
        <p className={`${title ? "mt-2" : ""} leading-7`}>
          {lines.map((l, i) => (
            <Fragment key={i}>
              {i > 0 ? <br /> : null}
              {l}
            </Fragment>
          ))}
        </p>
      )}
      {notAdvice ? (
        <p
          className="mt-3 text-xs italic leading-5"
          style={{ color: "var(--text-muted)" }}
        >
          Educational guidance, not legal or compensation advice.
        </p>
      ) : null}
    </aside>
  );
}

function paletteFor(severity: "info" | "amber" | "red" | "green") {
  switch (severity) {
    case "info":
      return {
        bg: "var(--accent-soft)",
        border: "var(--accent)",
        title: "var(--accent)",
      };
    case "green":
      return {
        bg: "var(--green-bg)",
        border: "var(--green-border)",
        title: "var(--green)",
      };
    case "amber":
      return {
        bg: "var(--amber-bg)",
        border: "var(--amber-border)",
        title: "var(--amber)",
      };
    case "red":
      return {
        bg: "var(--red-bg)",
        border: "var(--red-border)",
        title: "var(--red)",
      };
  }
}
