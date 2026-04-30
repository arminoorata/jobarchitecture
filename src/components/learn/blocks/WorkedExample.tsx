type Props = {
  title: string;
  lines: string[];
  footnote?: string;
};

/**
 * A worked example block. Heading on top, then `lines[]` rendered in
 * monospace so any arithmetic, dates, or aligned text reads cleanly. An
 * optional footnote renders smaller and muted at the bottom.
 */
export function WorkedExample({ title, lines, footnote }: Props) {
  return (
    <figure
      className="rounded-[var(--radius-card)] border p-4 md:p-5"
      style={{
        background: "var(--surface-alt)",
        borderColor: "var(--line)",
      }}
    >
      <figcaption className="text-base font-semibold tracking-tight">
        {title}
      </figcaption>
      <ol
        className="mt-3 space-y-1.5 font-mono text-sm leading-6"
        style={{ color: "var(--text)" }}
      >
        {lines.map((line, i) => (
          <li key={i} className="flex gap-3">
            <span
              aria-hidden="true"
              className="select-none tabular-nums"
              style={{ color: "var(--muted)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 whitespace-pre-wrap">{line}</span>
          </li>
        ))}
      </ol>
      {footnote ? (
        <p
          className="mt-3 text-xs italic leading-5"
          style={{ color: "var(--text-muted)" }}
        >
          {footnote}
        </p>
      ) : null}
    </figure>
  );
}
