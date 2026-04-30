type Props = {
  title?: string;
  items: string[];
};

/**
 * Closing card of a module. Heading defaults to "Take these to your next
 * conversation." when the module doesn't override it. Items render as
 * italicized prompts with leading bullets so they read like questions you'd
 * carry into a 1:1 or a calibration session.
 */
export function QuestionsCard({ title, items }: Props) {
  if (items.length === 0) return null;
  return (
    <section
      className="rounded-[var(--radius-card)] border p-5 md:p-6"
      style={{
        background: "var(--surface)",
        borderColor: "var(--line)",
      }}
      aria-label={title ?? "Questions to take with you"}
    >
      <h3 className="text-lg font-semibold tracking-tight">
        {title ?? "Take these to your next conversation."}
      </h3>
      <ul className="mt-3 space-y-2 leading-7" style={{ color: "var(--muted)" }}>
        {items.map((q) => (
          <li key={q} className="flex gap-2">
            <span aria-hidden="true" style={{ color: "var(--accent)" }}>
              •
            </span>
            <span className="italic">{q}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
