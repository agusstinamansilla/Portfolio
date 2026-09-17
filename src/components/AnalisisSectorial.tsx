import { PortfolioData } from "@/lib/types";
import { getClasificacion, getSectorAmplio } from "@/lib/clasificacion";
import { DonutChart, DonutSlice } from "./DonutChart";

function aggregate(items: { key: string; value: number }[]): DonutSlice[] {
  const map = new Map<string, number>();
  for (const { key, value } of items) {
    map.set(key, (map.get(key) ?? 0) + value);
  }
  return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
}

export function AnalisisSectorial({ data }: { data: PortfolioData }) {
  const holdings = [...data.acciones, ...data.etfs];

  const porSector = aggregate(
    holdings.map((h) => ({ key: getSectorAmplio(getClasificacion(h.simbolo).sector), value: h.valorActual }))
  );
  const porRegion = aggregate(
    holdings.map((h) => ({ key: getClasificacion(h.simbolo).region, value: h.valorActual }))
  );

  // De mayor a menor valor actual, para el índice de empresas de abajo.
  // Un mismo símbolo puede tener más de una posición (p.ej. dos lotes de
  // SPY) — en el índice se muestra una sola vez, no una fila por lote.
  const vistos = new Set<string>();
  const holdingsOrdenados = [...holdings]
    .sort((a, b) => b.valorActual - a.valorActual)
    .filter((h) => {
      if (vistos.has(h.simbolo)) return false;
      vistos.add(h.simbolo);
      return true;
    });

  return (
    <>
      <section className="mb-14">
        <div className="border-b border-hairline pb-3 mb-6">
          <h2 className="font-display text-[1.4rem] tracking-tight text-text">Composición por industria</h2>
        </div>
        <DonutChart slices={porSector} />
      </section>

      <section className="mb-14">
        <div className="border-b border-hairline pb-3 mb-6">
          <h2 className="font-display text-[1.4rem] tracking-tight text-text">Composición por región</h2>
        </div>
        <DonutChart slices={porRegion} />
      </section>

      <section className="mb-14">
        <div className="border-b border-hairline pb-3 mb-1">
          <h2 className="font-display text-[1.4rem] tracking-tight text-text">Activos de la cartera</h2>
        </div>
        <div className="divide-y divide-hairline-soft">
          {holdingsOrdenados.map((h, i) => {
            const c = getClasificacion(h.simbolo);
            return (
              <div key={`${h.simbolo}-${i}`} className="py-5">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono text-accent-bright text-sm">{h.simbolo}</span>
                  <span className="text-text text-sm font-medium">{h.empresa}</span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-faint mb-2">
                  <span>{c.sector}</span>
                  <span>·</span>
                  <span>{c.region}</span>
                </div>
                {c.descripcion ? (
                  <p className="text-sm text-text-muted leading-relaxed max-w-2xl">{c.descripcion}</p>
                ) : (
                  <p className="text-sm text-text-faint italic">Sin clasificar todavía.</p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
