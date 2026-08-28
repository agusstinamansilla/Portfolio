"use client";

import { ReactNode } from "react";
import { usePortfolioData } from "@/lib/usePortfolio";
import { fmtDateTime, fmtUsd } from "@/lib/format";
import { NavTabs } from "./NavTabs";
import { PortfolioData } from "@/lib/types";

type Active = "resumen" | "posiciones" | "operaciones";

export function PageShell({ active, children }: { active: Active; children: (data: PortfolioData) => ReactNode }) {
  const { data, error, loading } = usePortfolioData();

  return (
    <main className="min-h-screen">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <Masthead updatedAt={data?.updatedAt} total={data?.resumen.total ?? null} />
        <NavTabs active={active} />

        {loading && !data && <LoadingState />}

        {error && (
          <div className="border border-negative/30 bg-negative/5 rounded-sm px-5 py-4 mb-10 text-sm text-negative">
            No se pudo actualizar la cartera. {error}
          </div>
        )}

        {data && <div className="fade-in">{children(data)}</div>}

        <Footer />
      </div>
    </main>
  );
}

function Masthead({ updatedAt, total }: { updatedAt?: string; total: number | null }) {
  return (
    <header className="mb-8 sm:mb-10">
      <div className="flex items-center justify-between mb-8">
        <span className="text-xs tracking-[0.2em] uppercase text-text-faint">Inviu · Estado de cartera</span>
        {updatedAt && (
          <span className="text-xs text-text-faint font-mono hidden sm:inline">Actualizado {fmtDateTime(updatedAt)}</span>
        )}
      </div>
      <h1 className="font-display italic text-[2.9rem] sm:text-[4rem] leading-[1.05] text-text">
        {total !== null ? fmtUsd(total) : "—"}
      </h1>
      <p className="text-text-muted text-sm mt-2">Valor total de la cartera al día de hoy</p>
    </header>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3 mb-16">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-16 rounded-sm bg-surface animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-20 pt-6 border-t border-hairline-soft">
      <p className="text-xs text-text-faint leading-relaxed max-w-lg">
        Los datos se actualizan automáticamente desde la planilla de gestión. Las cotizaciones pueden tener una demora
        de hasta 20 minutos y se muestran con fines informativos, no constituyen asesoramiento ni recomendación de
        inversión.
      </p>
    </footer>
  );
}
