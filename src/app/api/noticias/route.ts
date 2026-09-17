import { NextResponse } from "next/server";
import { fetchSheetGrids } from "@/lib/sheets";
import { buildPortfolioData } from "@/lib/parse";
import { FIXTURE_TOTAL_CUENTA, FIXTURE_OPERACIONES } from "@/lib/fixtures";
import { fetchYahooNews, NoticiaItem } from "@/lib/yahooNews";

// News doesn't need a 60s refresh like prices do — cache longer to go easy
// on the unofficial endpoint and avoid rate-limiting.
export const revalidate = 1800;

export async function GET() {
  try {
    const { totalCuenta, operaciones } =
      process.env.USE_FIXTURES === "1"
        ? { totalCuenta: FIXTURE_TOTAL_CUENTA, operaciones: FIXTURE_OPERACIONES }
        : await fetchSheetGrids();

    const portfolio = buildPortfolioData(totalCuenta, operaciones);
    const holdings = [...portfolio.acciones, ...portfolio.etfs];
    const simbolos = holdings.map((h) => h.simbolo);
    const empresaPorSimbolo = new Map<string, string>();
    for (const h of holdings) {
      if (!empresaPorSimbolo.has(h.simbolo)) empresaPorSimbolo.set(h.simbolo, h.empresa);
    }

    // USE_FIXTURES=1 fakes the Yahoo response too, since that endpoint isn't
    // reachable from every dev environment — real news needs a real deploy.
    let noticias: NoticiaItem[];
    let warnings: string[];
    if (process.env.USE_FIXTURES === "1") {
      const unique = Array.from(new Set(simbolos));
      noticias = unique.slice(0, 8).flatMap((simbolo, i) => [
        {
          simbolo,
          empresa: "",
          titulo: `${simbolo} anuncia resultados por encima de lo esperado en el ultimo trimestre`,
          fuente: "Reuters",
          fecha: new Date(Date.now() - i * 3 * 3600_000).toISOString(),
          url: "https://finance.yahoo.com/",
        },
        {
          simbolo,
          empresa: "",
          titulo: `Analistas revisan el precio objetivo de ${simbolo} tras la presentacion de resultados`,
          fuente: "Bloomberg",
          fecha: new Date(Date.now() - (i * 3 + 1) * 3600_000).toISOString(),
          url: "https://finance.yahoo.com/",
        },
      ]);
      noticias.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      warnings = [];
    } else {
      const result = await fetchYahooNews(simbolos, 3);
      noticias = result.noticias;
      warnings = result.errores;
    }

    const noticiasConEmpresa = noticias.map((n) => ({ ...n, empresa: empresaPorSimbolo.get(n.simbolo) ?? "" }));

    return NextResponse.json({ updatedAt: new Date().toISOString(), noticias: noticiasConEmpresa, warnings });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
