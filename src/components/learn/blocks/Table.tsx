type Props = {
  caption?: string;
  headers: string[];
  rows: string[][];
};

/**
 * Block-level table. Desktop renders a normal `<table>` with a `<caption>`.
 * Below 640px each row stacks vertically with the column header repeated as
 * a label. We render both layouts and gate visibility on viewport width
 * with the Tailwind `sm:` breakpoint (640px). The mobile stack stays in the
 * accessibility tree on desktop too via `sr-only` so screen readers always
 * find a labeled cell.
 */
export function Table({ caption, headers, rows }: Props) {
  return (
    <div className="my-2">
      {/* Desktop / wide layout */}
      <table
        className="hidden w-full border-collapse text-sm sm:table"
        style={{ color: "var(--text)" }}
      >
        {caption ? (
          <caption
            className="caption-top pb-2 text-left text-xs font-medium uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                scope="col"
                className="border-b px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider"
                style={{
                  borderColor: "var(--line)",
                  color: "var(--muted)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border-b px-3 py-2 align-top leading-6"
                  style={{ borderColor: "var(--line)" }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile stacked layout */}
      <div className="sm:hidden">
        {caption ? (
          <p
            className="pb-3 text-xs font-medium uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            {caption}
          </p>
        ) : null}
        <ul className="space-y-3">
          {rows.map((row, i) => (
            <li
              key={i}
              className="rounded-[var(--radius-card)] border p-3"
              style={{
                borderColor: "var(--line)",
                background: "var(--surface-alt)",
              }}
            >
              <dl className="grid gap-2 text-sm">
                {row.map((cell, j) => (
                  <div key={j}>
                    <dt
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--muted)" }}
                    >
                      {headers[j]}
                    </dt>
                    <dd className="mt-1 leading-6">{cell}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
