export type NoticiaItem = {
  simbolo: string;
  titulo: string;
  fuente: string;
  fecha: string; // ISO
  url: string;
};

type YahooSearchResponse = {
  news?: Array<{
    uuid: string;
    title: string;
    publisher: string;
    link: string;
    providerPublishTime: number; // unix seconds
  }>;
};

/**
 * Yahoo Finance's search endpoint (unofficial, same family as the chart
 * endpoint used elsewhere in this app) returns a "news" array alongside
 * quote matches when you search a ticker. No API key needed, but it's less
 * standardized than the price endpoint — coverage can be thin for less
 * widely-covered ADRs, and it can occasionally rate-limit.
 */
async function fetchYahooNewsForSymbol(symbol: string, limit: number): Promise<NoticiaItem[]> {
  const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
    symbol
  )}&newsCount=${limit}&quotesCount=0&lang=en-US`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; PortfolioDashboard/1.0)",
      Accept: "application/json",
    },
    next: { revalidate: 1800 },
  });

  if (!res.ok) {
    throw new Error(`Yahoo Finance respondio ${res.status} para noticias de ${symbol}`);
  }

  const data = (await res.json()) as YahooSearchResponse;
  const items = data.news ?? [];

  return items.slice(0, limit).map((n) => ({
    simbolo: symbol,
    titulo: n.title,
    fuente: n.publisher,
    fecha: new Date(n.providerPublishTime * 1000).toISOString(),
    url: n.link,
  }));
}

export async function fetchYahooNews(
  symbols: string[],
  perSymbol = 3
): Promise<{ noticias: NoticiaItem[]; errores: string[] }> {
  const unique = Array.from(new Set(symbols.map((s) => s.trim().toUpperCase()).filter(Boolean)));

  const settled = await Promise.allSettled(unique.map((s) => fetchYahooNewsForSymbol(s, perSymbol)));

  const noticias: NoticiaItem[] = [];
  const errores: string[] = [];
  settled.forEach((r, i) => {
    if (r.status === "fulfilled") {
      noticias.push(...r.value);
    } else {
      errores.push(`${unique[i]}: ${r.reason instanceof Error ? r.reason.message : "error desconocido"}`);
    }
  });

  noticias.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  return { noticias, errores };
}
