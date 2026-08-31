"use client";

import { useVariacionesHoy } from "@/lib/useVariacionesHoy";
import { fmtDateTime, fmtPct, fmtUsd } from "@/lib/format";

export function VariacionesHoyTable() {
  const { data, error, loading } = useVariacionesHoy();

  if (loading && !data) {
    return (
      <div className="space-y-3 mb-16">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 rounded-sm bg-surface animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-negative/30 bg-negative/5 rounded-sm px-5 py-4 mb-10 text-sm text-negative">
        No se pudieron cargar las variaciones de hoy. {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <section className="mb-14 fade-in">
      <div className="flex items-baseline justify-between border-b border-hairline pb-3 mb-1">
        <h2 className="font-display text-[1.4rem] tracking-tight text-text">Variaciones de hoy</h2>
        <span className="text-xs text-text-faint font-mono hidden sm:inline">{fmtDateTime(data.updatedAt)}</span>
      </div>

      <div className="divide-y divide-hairline-soft">
        {data.variaciones.map((v, i) => (
          <div key={`${v.simbolo}-${i}`} className="flex items-center justify-between py-3.5 text-sm">
            <div>
              <span className="font-mono text-accent-bright text-base">{v.simbolo}</span>
              {v.empresa && <div className="text-text-muted text-xs mt-0.5">{v.empresa}</div>}
            </div>
            {v.precioHoy === null ? (
              <span className="text-text-faint text-xs">Sin datos</span>
            ) : (
              <div className="text-right">
                <div className="font-mono tabular text-base font-medium">{fmtUsd(v.precioHoy, { decimals: 2 })}</div>
                <div className={`font-mono tabular text-sm ${(v.variacion ?? 0) >= 0 ? "text-positive" : "text-negative"}`}>
                  {fmtPct(v.variacion, 2)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-text-faint leading-relaxed mt-6">
        Variación contra el cierre de la rueda anterior. Cotizaciones con demora, con fines informativos.
      </p>
    </section>
  );
}
