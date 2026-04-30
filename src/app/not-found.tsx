import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 md:px-10">
      <section
        className="rounded-[var(--radius-card)] border p-8"
        style={{
          borderColor: "var(--line)",
          background: "var(--surface)",
        }}
      >
        <p
          className="text-xs font-medium uppercase tracking-[0.32em]"
          style={{ color: "var(--accent)" }}
        >
          Not found
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          This page is not part of the toolkit.
        </h1>
        <p className="mt-4 leading-7" style={{ color: "var(--muted)" }}>
          The main workflow is still available from the overview.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full border px-4 py-2 text-sm font-semibold"
          style={{
            borderColor: "var(--accent)",
            background: "var(--accent-soft)",
            color: "var(--text)",
          }}
        >
          Return to overview
        </Link>
      </section>
    </main>
  );
}
