import { Resumen, ResultadoPeriodo } from "@/lib/types";
import { fmtPct, fmtUsd } from "@/lib/format";

export function SummaryStrip({ resumen, resultados }: { resumen: Resumen; resultados: ResultadoPeriodo[] }) {
  return (
    <section className="mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label="Activos invertidos" value={fmtUsd(resumen.activos)} />
        <Stat
          label="Efectivo"
          value={fmtUsd(resumen.efectivo)}
          sub={
            [
              resumen.pctEfectivo !== null ? `${fmtPct(resumen.pctEfectivo, 1).replace("+", "")} de la cartera` : null,
              resumen.tasaEfectivo ? `remunerado al ${resumen.tasaEfectivo}` : null,
            ]
              .filter(Boolean)
              .join(" · ") || undefined
          }
        />
        <Stat label="Valor total" value={fmtUsd(resumen.total)} emphasis />
      </div>

      {resultados.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {resultados.map((r) => {
            const sinDatos = r.ganancia === null && r.variacion === null;
            const positivo = (r.ganancia ?? 0) >= 0;
            return (
              <div key={r.label} className="bg-surface border border-hairline rounded-lg px-5 py-5 shadow-[0_1px_2px_rgba(20,23,28,0.04)]">
                <div className="text-[0.7rem] uppercase tracking-[0.14em] text-text-faint mb-2">{r.label}</div>
                {sinDatos ? (
                  <div className="text-text-faint text-sm">Sin datos</div>
                ) : (
                  <>
                    <div className={`font-display text-2xl tabular ${positivo ? "text-positive" : "text-negative"}`}>
                      {positivo ? "+" : ""}
                      {fmtUsd(r.ganancia)}
                    </div>
                    <div className={`font-mono text-sm tabular mt-1 ${positivo ? "text-positive" : "text-negative"}`}>
                      {fmtPct(r.variacion, 2)}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, sub, emphasis }: { label: string; value: string; sub?: string; emphasis?: boolean }) {
  return (
    <div className={`rounded-lg border px-5 py-6 shadow-[0_1px_2px_rgba(20,23,28,0.04)] ${emphasis ? "bg-surface-2 border-accent/40 border-t-2 border-t-accent" : "bg-surface border-hairline"}`}>
      <div className="text-[0.7rem] uppercase tracking-[0.14em] text-text-faint mb-2">{label}</div>
      <div className={`font-display tabular ${emphasis ? "text-3xl text-text" : "text-2xl"}`}>{value}</div>
      {sub && <div className="text-xs text-text-faint mt-1.5">{sub}</div>}
    </div>
  );
}
