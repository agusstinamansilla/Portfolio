import { PersonaResultado } from "@/lib/types";
import { fmtPct, fmtUsd } from "@/lib/format";

export function PersonasTable({ personas }: { personas: PersonaResultado[] }) {
  if (personas.length === 0) return null;

  return (
    <section className="mb-14">
      <div className="flex items-baseline justify-between border-b border-hairline pb-3 mb-1">
        <h2 className="font-display text-[1.4rem] tracking-tight text-text">Primer semestre por persona</h2>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-text-faint text-[0.7rem] uppercase tracking-[0.12em]">
            <th className="text-left font-medium py-2.5 pr-3">Persona</th>
            <th className="text-right font-medium py-2.5 px-3">Valor al inicio</th>
            <th className="text-right font-medium py-2.5 px-3">Fin de primer Q</th>
            <th className="text-right font-medium py-2.5 px-3">Ganancia</th>
            <th className="text-right font-medium py-2.5 pl-3">Var.</th>
          </tr>
        </thead>
        <tbody>
          {personas.map((p) => (
            <tr
              key={p.persona}
              className={`border-t border-hairline-soft ${p.persona === "Total" ? "font-medium" : ""}`}
            >
              <td className="py-3 pr-3">{p.persona}</td>
              <td className="text-right py-3 px-3 font-mono tabular text-text-muted">{fmtUsd(p.valorInicio)}</td>
              <td className="text-right py-3 px-3 font-mono tabular">{fmtUsd(p.valorFin)}</td>
              <td className={`text-right py-3 px-3 font-mono tabular ${(p.ganancia ?? 0) >= 0 ? "text-positive" : "text-negative"}`}>
                {(p.ganancia ?? 0) >= 0 ? "+" : ""}
                {fmtUsd(p.ganancia)}
              </td>
              <td className={`text-right py-3 pl-3 font-mono tabular ${(p.variacion ?? 0) >= 0 ? "text-positive" : "text-negative"}`}>
                {fmtPct(p.variacion, 2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
