import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { modules } from "@/data/modules";
import { ModuleRenderer } from "@/components/learn/ModuleRenderer";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return modules.map((module) => ({ id: module.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const module = modules.find((m) => m.id === id);
  if (!module) {
    return {
      title: "Module not found",
      description: "This module is not part of the toolkit.",
    };
  }
  return {
    title: { absolute: `${module.title} · Job Architecture Toolkit` },
    description: module.blurb,
  };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const module = modules.find((m) => m.id === id);
  if (!module) notFound();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
      <nav
        aria-label="Breadcrumb"
        className="text-xs font-medium uppercase tracking-[0.28em]"
        style={{ color: "var(--text-muted)" }}
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href="/"
              className="rounded hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{ color: "var(--text-muted)" }}
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link
              href="/learn"
              className="rounded hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{ color: "var(--text-muted)" }}
            >
              Learn
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li style={{ color: "var(--text)" }}>{module.title}</li>
        </ol>
      </nav>
      <ModuleRenderer module={module} />
    </main>
  );
}
