"use client";

import { useEffect, useState, useCallback } from "react";
import { PortfolioData } from "@/lib/types";
import { fmtDateTime, fmtUsd } from "@/lib/format";
import { HoldingsTable } from "@/components/HoldingsTable";
import { SummaryStrip } from "@/components/SummaryStrip";
import { OperacionesLog } from "@/components/OperacionesLog";

const REFRESH_MS = 60_000;

export default function Home() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/portfolio", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al cargar la cartera.");
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch on mount, then poll so the client dashboard reflects
    // changes made to the source Google Sheet without a manual reload.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  return (
    <main className="min-h-screen">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <Masthead updatedAt={data?.updatedAt} total={data?.resumen.total ?? null} />

        {loading && !data && <LoadingState />}

        {error && (
          <div className="border border-negative/30 bg-negative/5 rounded-sm px-5 py-4 mb-10 text-sm text-negative">
            No se pudo actualizar la cartera. {error}
          </div>
        )}

        {data && (
          <div className="fade-in">
            <SummaryStrip resumen={data.resumen} resultados={data.resultados} />
            <HoldingsTable title="Acciones" subtitle={`${data.acciones.length} posiciones`} holdings={data.acciones} />
            <HoldingsTable title="ETFs" subtitle={`${data.etfs.length} posiciones`} holdings={data.etfs} />
            <OperacionesLog operaciones={data.operaciones} />
          </div>
        )}

        <Footer />
      </div>
    </main>
  );
}

function Masthead({ updatedAt, total }: { updatedAt?: string; total: number | null }) {
  return (
    <header className="mb-12 sm:mb-16">
      <div className="flex items-center justify-between mb-8">
        <span className="text-xs tracking-[0.2em] uppercase text-text-faint">Inviu · Estado de cartera</span>
        {updatedAt && (
          <span className="text-xs text-text-faint font-mono hidden sm:inline">Actualizado {fmtDateTime(updatedAt)}</span>
        )}
      </div>
      <h1 className="font-display italic text-[2.5rem] sm:text-[3.4rem] leading-[1.05] text-text">
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
