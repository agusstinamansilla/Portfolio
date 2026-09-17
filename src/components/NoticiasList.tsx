"use client";

import { useNoticias } from "@/lib/useNoticias";
import { fmtDateTime } from "@/lib/format";
import { NoticiaItem } from "@/lib/types";

function agruparPorEmpresa(noticias: NoticiaItem[]) {
  const map = new Map<string, NoticiaItem[]>();
  for (const n of noticias) {
    const arr = map.get(n.simbolo) ?? [];
    arr.push(n);
    map.set(n.simbolo, arr);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([simbolo, items]) => ({
      simbolo,
      empresa: items[0]?.empresa ?? "",
      items: [...items].sort((x, y) => new Date(y.fecha).getTime() - new Date(x.fecha).getTime()),
    }));
}

export function NoticiasList() {
  const { data, error, loading } = useNoticias();

  if (loading && !data) {
    return (
      <div className="space-y-3 mb-16">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-sm bg-surface animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-negative/30 bg-negative/5 rounded-sm px-5 py-4 mb-10 text-sm text-negative">
        No se pudieron cargar las noticias. {error}
      </div>
    );
  }

  if (!data) return null;

  const grupos = agruparPorEmpresa(data.noticias);

  return (
    <section className="mb-14 fade-in">
      <div className="flex items-baseline justify-between border-b border-hairline pb-3 mb-1">
        <h2 className="font-display text-[1.4rem] tracking-tight text-text">Noticias</h2>
        <span className="text-xs text-text-faint font-mono hidden sm:inline">{fmtDateTime(data.updatedAt)}</span>
      </div>

      {grupos.length === 0 ? (
        <p className="text-text-faint text-sm py-6">No hay noticias disponibles por el momento.</p>
      ) : (
        <div className="divide-y divide-hairline">
          {grupos.map((grupo) => (
            <div key={grupo.simbolo} className="py-5">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-mono text-accent-bright text-sm">{grupo.simbolo}</span>
                {grupo.empresa && <span className="text-text text-sm font-medium">{grupo.empresa}</span>}
              </div>
              <div className="space-y-3 pl-1">
                {grupo.items.map((n, i) => (
                  <a
                    key={`${n.url}-${i}`}
                    href={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="text-sm text-text group-hover:text-accent-bright transition-colors leading-snug">
                      {n.titulo}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-text-faint text-xs">{n.fuente}</span>
                      <span className="text-text-faint text-xs">·</span>
                      <span className="text-text-faint text-xs font-mono">{fmtDateTime(n.fecha)}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-text-faint leading-relaxed mt-6">
        Noticias de Yahoo Finance sobre los activos de la cartera, con fines informativos.
      </p>
    </section>
  );
}
