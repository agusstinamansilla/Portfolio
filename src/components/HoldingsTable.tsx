import { Holding } from "@/lib/types";
import { fmtNum, fmtPct, fmtUsd } from "@/lib/format";

export function HoldingsTable({ title, subtitle, holdings }: { title: string; subtitle?: string; holdings: Holding[] }) {
  if (holdings.length === 0) return null;

  const totalValor = holdings.reduce((s, h) => s + h.valorActual, 0);
  const totalGanancia = holdings.reduce((s, h) => s + h.ganancia, 0);

  return (
    <section className="mb-14">
      <div className="flex items-baseline justify-between border-b border-hairline pb-3 mb-1">
        <h2 className="font-display text-[1.4rem] tracking-tight text-text">{title}</h2>
        {subtitle && <span className="text-xs text-text-faint uppercase tracking-[0.14em]">{subtitle}</span>}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-text-faint text-[0.7rem] uppercase tracking-[0.12em]">
              <th className="text-left font-medium py-2.5 pr-3">Activo</th>
              <th className="text-right font-medium py-2.5 px-3">Cantidad</th>
              <th className="text-right font-medium py-2.5 px-3">Precio actual</th>
              <th className="text-right font-medium py-2.5 px-3">Precio compra</th>
              <th className="text-right font-medium py-2.5 px-3">Valor actual</th>
              <th className="text-right font-medium py-2.5 px-3">Valor compra</th>
              <th className="text-right font-medium py-2.5 px-3">Result.</th>
              <th className="text-right font-medium py-2.5 px-3">Var.</th>
              <th className="text-right font-medium py-2.5 pl-3">% cartera</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h, i) => (
              <tr key={`${h.simbolo}-${i}`} className="border-t border-hairline-soft hover:bg-surface/60 transition-colors">
                <td className="py-3 pr-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-accent-bright text-[0.8rem]">{h.simbolo}</span>
                    {h.comentario && (
                      <span className="text-[0.65rem] text-text-faint border border-hairline rounded-full px-1.5 py-0.5">
                        {h.comentario}
                      </span>
                    )}
                  </div>
                  <div className="text-text-muted text-xs mt-0.5">{h.empresa}</div>
                </td>
                <td className="text-right py-3 px-3 font-mono tabular text-text-muted">{fmtNum(h.cantidad, h.cantidad % 1 ? 2 : 0)}</td>
                <td className="text-right py-3 px-3 font-mono tabular">{fmtUsd(h.precioActual, { decimals: 2 })}</td>
                <td className="text-right py-3 px-3 font-mono tabular text-text-muted">{fmtUsd(h.precioCompra, { decimals: 2 })}</td>
                <td className="text-right py-3 px-3 font-mono tabular font-medium">{fmtUsd(h.valorActual)}</td>
                <td className="text-right py-3 px-3 font-mono tabular text-text-muted">{fmtUsd(h.valorCompra)}</td>
                <td className={`text-right py-3 px-3 font-mono tabular ${h.ganancia >= 0 ? "text-positive" : "text-negative"}`}>
                  {h.ganancia >= 0 ? "+" : ""}
                  {fmtUsd(h.ganancia)}
                </td>
                <td className={`text-right py-3 px-3 font-mono tabular ${h.variacion >= 0 ? "text-positive" : "text-negative"}`}>
                  {fmtPct(h.variacion)}
                </td>
                <td className="text-right py-3 pl-3 font-mono tabular text-text-muted">{fmtPct(h.pctCartera, 1)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-accent/25">
              <td className="py-3 pr-3 text-xs uppercase tracking-[0.12em] text-text-faint">Subtotal</td>
              <td colSpan={3}></td>
              <td className="text-right py-3 px-3 font-mono tabular font-medium">{fmtUsd(totalValor)}</td>
              <td></td>
              <td className={`text-right py-3 px-3 font-mono tabular font-medium ${totalGanancia >= 0 ? "text-positive" : "text-negative"}`}>
                {totalGanancia >= 0 ? "+" : ""}
                {fmtUsd(totalGanancia)}
              </td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="md:hidden divide-y divide-hairline-soft">
        {holdings.map((h, i) => (
          <div key={`${h.simbolo}-${i}`} className="py-3">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-accent-bright text-[0.85rem]">{h.simbolo}</span>
              <span className="font-mono tabular font-medium">{fmtUsd(h.valorActual)}</span>
            </div>
            <div className="text-text-muted text-xs mt-0.5">{h.empresa}</div>
            <div className="flex items-baseline justify-between mt-1.5 text-xs">
              <span className="text-text-faint font-mono">
                {fmtNum(h.cantidad, h.cantidad % 1 ? 2 : 0)} × {fmtUsd(h.precioActual, { decimals: 2 })}
              </span>
              <span className={`font-mono ${h.variacion >= 0 ? "text-positive" : "text-negative"}`}>
                {fmtPct(h.variacion)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
