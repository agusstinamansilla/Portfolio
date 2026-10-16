import { PersonaResultado } from "@/lib/types";
import { fmtPct, fmtUsd } from "@/lib/format";

export function PersonasTable({ personas }: { personas: PersonaResultado[] }) {
  if (personas.length === 0) return null;

  return (
    <section className="mb-14">
      <div className="flex items-baseline justify-between pb-3 mb-3">
        <h2 className="font-display text-[1.4rem] tracking-tight text-text">Primer semestre por persona</h2>
      </div>
      <div className="border border-hairline rounded-lg overflow-hidden bg-surface shadow-[0_1px_2px_rgba(20,23,28,0.04)]">
      <table className="zebra w-full text-sm">
        <thead>
          <tr className="bg-surface-2 text-text-muted text-[0.7rem] uppercase tracking-[0.12em]">
            <th className="text-left font-medium py-3 pl-5 pr-3">Persona</th>
            <th className="text-right font-medium py-2.5 px-3">Valor al inicio</th>
            <th className="text-right font-medium py-2.5 px-3">Fin de primer Q</th>
            <th className="text-right font-medium py-2.5 px-3">Ganancia</th>
            <th className="text-right font-medium py-3 pl-3 pr-5">Var.</th>
          </tr>
        </thead>
        <tbody>
          {personas.map((p) => (
            <tr
              key={p.persona}
              className={`border-t border-hairline-soft ${p.persona === "Total" ? "font-semibold bg-surface-2" : ""}`}
            >
              <td className="py-3.5 pl-5 pr-3">{p.persona}</td>
              <td className="text-right py-3.5 px-3 font-mono tabular text-text-muted">{fmtUsd(p.valorInicio)}</td>
              <td className="text-right py-3.5 px-3 font-mono tabular">{fmtUsd(p.valorFin)}</td>
              <td className={`text-right py-3.5 px-3 font-mono tabular ${(p.ganancia ?? 0) >= 0 ? "text-positive" : "text-negative"}`}>
                {(p.ganancia ?? 0) >= 0 ? "+" : ""}
                {fmtUsd(p.ganancia)}
              </td>
              <td className={`text-right py-3.5 pl-3 pr-5 font-mono tabular ${(p.variacion ?? 0) >= 0 ? "text-positive" : "text-negative"}`}>
                {fmtPct(p.variacion, 2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </section>
  );
}
