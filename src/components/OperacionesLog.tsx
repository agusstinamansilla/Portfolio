import { Operacion } from "@/lib/types";
import { fmtDate, fmtNum } from "@/lib/format";

export function OperacionesLog({ operaciones }: { operaciones: Operacion[] }) {
  if (operaciones.length === 0) return null;

  return (
    <section className="mb-14">
      <div className="flex items-baseline justify-between border-b border-hairline pb-3 mb-1">
        <h2 className="font-display text-[1.4rem] tracking-tight text-text">Operaciones</h2>
        <span className="text-xs text-text-faint uppercase tracking-[0.14em]">
          últimos {operaciones.length} · valores en US$
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="zebra w-full text-[0.85rem] sm:text-[1rem]">
          <thead>
            <tr className="text-text-muted text-[0.78rem] uppercase tracking-[0.06em] sm:tracking-[0.1em]">
              <th className="text-left font-medium py-3 pr-1.5 sm:pr-3">Fecha</th>
              <th className="text-left font-medium py-3 px-1.5 sm:px-3">Operación</th>
              <th className="text-left font-medium py-3 px-1.5 sm:px-3">Ticker</th>
              <th className="text-right font-medium py-3 px-1.5 sm:px-3">Cantidad</th>
              <th className="text-right font-medium py-3 px-1.5 sm:px-3">Precio</th>
              <th className="text-right font-medium py-3 pl-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {operaciones.map((op, i) => {
              const isCompra = op.tipo.trim().toUpperCase().startsWith("COMPRA");
              return (
                <tr key={i} className="border-t border-hairline-soft">
                  <td className="py-3.5 pr-1.5 sm:pr-3 text-text-muted whitespace-nowrap">{fmtDate(op.fecha)}</td>
                  <td className="py-3.5 px-1.5 sm:px-3">
                    <span
                      className={`inline-block min-w-[4.5rem] sm:min-w-[5.25rem] text-center text-[0.68rem] sm:text-[0.75rem] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-sm border ${
                        isCompra
                          ? "text-positive border-positive/30 bg-positive/5"
                          : "text-negative border-negative/30 bg-negative/5"
                      }`}
                    >
                      {isCompra ? "Compra" : "Venta"}
                    </span>
                  </td>
                  <td className="py-3.5 px-1.5 sm:px-3 font-mono font-bold text-ticker text-base sm:text-lg">{op.accion.trim()}</td>
                  <td className="text-right py-3.5 px-1.5 sm:px-3 font-mono tabular">{fmtNum(op.cantidad, op.cantidad % 1 ? 2 : 0)}</td>
                  <td className="text-right py-3.5 px-1.5 sm:px-3 font-mono tabular">{fmtNum(op.precio, 2)}</td>
                  <td className="text-right py-3.5 pl-3 font-mono tabular font-semibold">{fmtNum(op.total, 0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
