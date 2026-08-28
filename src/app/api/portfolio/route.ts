import { NextResponse } from "next/server";
import { fetchSheetGrids } from "@/lib/sheets";
import { buildPortfolioData } from "@/lib/parse";
import { FIXTURE_TOTAL_CUENTA, FIXTURE_OPERACIONES } from "@/lib/fixtures";

export const revalidate = 60;

export async function GET() {
  try {
    // USE_FIXTURES=1 lets you preview the dashboard without a live Google API key.
    const { totalCuenta, operaciones } =
      process.env.USE_FIXTURES === "1"
        ? { totalCuenta: FIXTURE_TOTAL_CUENTA, operaciones: FIXTURE_OPERACIONES }
        : await fetchSheetGrids();
    const data = buildPortfolioData(totalCuenta, operaciones);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
