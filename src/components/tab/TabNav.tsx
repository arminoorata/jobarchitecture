"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Overview" },
  { href: "/learn", label: "Learn" },
  { href: "/leveling", label: "Leveling Tool" },
  { href: "/calibration", label: "Calibration Lab" },
  { href: "/glossary", label: "Glossary" },
  { href: "/methodology", label: "Methodology" },
];

export default function TabNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Job architecture toolkit sections"
      className="border-b"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <ul
          className="flex gap-6 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {tabs.map((tab) => {
            const active = isActive(pathname, tab.href);
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className="flex items-center whitespace-nowrap py-3 text-sm transition-colors"
                  style={{
                    color: active ? "var(--text)" : "var(--text-muted)",
                    fontWeight: active ? 700 : 500,
                    borderBottom: active
                      ? "2px solid var(--accent)"
                      : "2px solid transparent",
                    marginBottom: "-1px",
                  }}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
