import { Resumen, ResultadoPeriodo } from "@/lib/types";
import { fmtPct, fmtUsd } from "@/lib/format";

export function SummaryStrip({ resumen, resultados }: { resumen: Resumen; resultados: ResultadoPeriodo[] }) {
  return (
    <section className="mb-16">
      <div className="grid grid-cols-2 md:grid-cols-3 border border-hairline rounded-sm overflow-hidden">
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-hairline mt-px">
          {resultados.map((r) => (
            <div key={r.label} className="bg-bg px-5 py-4">
              <div className="text-[0.68rem] uppercase tracking-[0.14em] text-text-faint mb-1.5">{r.label}</div>
              <div className={`font-mono text-lg tabular ${(r.variacion ?? 0) >= 0 ? "text-positive" : "text-negative"}`}>
                {fmtPct(r.variacion, 2)}
              </div>
              <div className="text-xs text-text-muted mt-1 font-mono tabular">
                {r.ganancia !== null && r.ganancia >= 0 ? "+" : ""}
                {fmtUsd(r.ganancia)}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, sub, emphasis }: { label: string; value: string; sub?: string; emphasis?: boolean }) {
  return (
    <div className={`px-5 py-5 border-hairline [&:not(:last-child)]:border-r [&:not(:last-child)]:border-b md:[&:not(:last-child)]:border-b-0 ${emphasis ? "bg-surface" : ""}`}>
      <div className="text-[0.68rem] uppercase tracking-[0.14em] text-text-faint mb-2">{label}</div>
      <div className={`font-display tabular ${emphasis ? "text-2xl text-accent-bright" : "text-xl"}`}>{value}</div>
      {sub && <div className="text-xs text-text-faint mt-1">{sub}</div>}
    </div>
  );
}
