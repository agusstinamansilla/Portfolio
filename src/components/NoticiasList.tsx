"use client";

import { useNoticias } from "@/lib/useNoticias";
import { fmtDateTime } from "@/lib/format";

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

  return (
    <section className="mb-14 fade-in">
      <div className="flex items-baseline justify-between border-b border-hairline pb-3 mb-1">
        <h2 className="font-display text-[1.4rem] tracking-tight text-text">Noticias</h2>
        <span className="text-xs text-text-faint font-mono hidden sm:inline">{fmtDateTime(data.updatedAt)}</span>
      </div>

      {data.noticias.length === 0 ? (
        <p className="text-text-faint text-sm py-6">No hay noticias disponibles por el momento.</p>
      ) : (
        <div className="divide-y divide-hairline-soft">
          {data.noticias.map((n, i) => (
            <a
              key={`${n.url}-${i}`}
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-4 group"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-accent-bright text-xs">{n.simbolo}</span>
                <span className="text-text-faint text-xs">·</span>
                <span className="text-text-faint text-xs">{n.fuente}</span>
                <span className="text-text-faint text-xs">·</span>
                <span className="text-text-faint text-xs font-mono">{fmtDateTime(n.fecha)}</span>
              </div>
              <div className="text-sm text-text group-hover:text-accent-bright transition-colors leading-snug">
                {n.titulo}
              </div>
            </a>
          ))}
        </div>
      )}

      <p className="text-xs text-text-faint leading-relaxed mt-6">
        Noticias de Yahoo Finance sobre los activos de la cartera, con fines informativos.
      </p>
    </section>
  );
}
