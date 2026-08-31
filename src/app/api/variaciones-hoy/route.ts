import { NextResponse } from "next/server";
import { fetchSheetGrids } from "@/lib/sheets";
import { parseVariacionesHoy } from "@/lib/parse";
import { FIXTURE_VAR_HOY } from "@/lib/fixtures";

export const revalidate = 60;

export async function GET() {
  try {
    const varHoyGrid =
      process.env.USE_FIXTURES === "1" ? FIXTURE_VAR_HOY : (await fetchSheetGrids()).varHoy;

    const warnings: string[] = [];
    const variaciones = parseVariacionesHoy(varHoyGrid, warnings);

    return NextResponse.json({ updatedAt: new Date().toISOString(), variaciones, warnings });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
