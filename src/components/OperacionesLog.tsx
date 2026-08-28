import { Operacion } from "@/lib/types";
import { fmtDate, fmtNum, fmtUsd } from "@/lib/format";

export function OperacionesLog({ operaciones }: { operaciones: Operacion[] }) {
  if (operaciones.length === 0) return null;

  return (
    <section className="mb-14">
      <div className="flex items-baseline justify-between border-b border-hairline pb-3 mb-1">
        <h2 className="font-display text-[1.4rem] tracking-tight text-text">Movimientos</h2>
        <span className="text-xs text-text-faint uppercase tracking-[0.14em]">últimos {operaciones.length}</span>
      </div>
      <div className="divide-y divide-hairline-soft">
        {operaciones.map((op, i) => {
          const isCompra = op.tipo.trim().toUpperCase().startsWith("COMPRA");
          return (
            <div key={i} className="flex items-center justify-between py-3 text-sm">
              <div className="flex items-center gap-3">
                <span
                  className={`text-[0.65rem] uppercase tracking-[0.1em] px-2 py-1 rounded-sm border ${
                    isCompra ? "text-positive border-positive/30 bg-positive/5" : "text-negative border-negative/30 bg-negative/5"
                  }`}
                >
                  {isCompra ? "Compra" : "Venta"}
                </span>
                <span className="font-mono text-accent-bright">{op.accion.trim()}</span>
                <span className="text-text-faint text-xs hidden sm:inline">{fmtDate(op.fecha)}</span>
              </div>
              <div className="text-right">
                <div className="font-mono tabular text-text">{fmtUsd(op.total)}</div>
                <div className="text-text-faint text-xs font-mono tabular">
                  {fmtNum(op.cantidad, op.cantidad % 1 ? 2 : 0)} × {fmtUsd(op.precio, { decimals: 2 })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
