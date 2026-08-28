"use client";

import Link from "next/link";

const TABS = [
  { href: "/", key: "resumen", label: "Resumen" },
  { href: "/posiciones", key: "posiciones", label: "Posiciones" },
  { href: "/operaciones", key: "operaciones", label: "Operaciones" },
] as const;

export function NavTabs({ active }: { active: (typeof TABS)[number]["key"] }) {
  return (
    <nav className="flex gap-6 border-b border-hairline mb-10">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={`text-sm pb-3 -mb-px border-b transition-colors ${
            tab.key === active
              ? "border-accent text-text"
              : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
