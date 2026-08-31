const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";

// Wide ranges: comfortably covers the sheet even as Agus adds rows/columns.
const RANGE_TOTAL_CUENTA = "Total cuenta!A1:Z250";
const RANGE_OPERACIONES = "operaciones!A1:J200";
// Sheet name has a space, needs single quotes in the A1 range notation.
const RANGE_VAR_HOY = "'Var. Hoy'!A1:Z250";

type SheetsValuesResponse = {
  values?: (string | number | null)[][];
};

async function fetchRange(spreadsheetId: string, apiKey: string, range: string) {
  const url = new URL(`${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(range)}`);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("valueRenderOption", "UNFORMATTED_VALUE");
  url.searchParams.set("dateTimeRenderOption", "FORMATTED_STRING");

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Google Sheets API respondio ${res.status} para el rango "${range}": ${body.slice(0, 300)}`
    );
  }
  const data = (await res.json()) as SheetsValuesResponse;
  return data.values ?? [];
}

export async function fetchSheetGrids() {
  const spreadsheetId = process.env.SHEET_ID;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!spreadsheetId || !apiKey) {
    throw new Error(
      "Faltan las variables de entorno SHEET_ID y/o GOOGLE_API_KEY. Configuralas en Vercel > Settings > Environment Variables."
    );
  }

  const [totalCuenta, operaciones, varHoy] = await Promise.all([
    fetchRange(spreadsheetId, apiKey, RANGE_TOTAL_CUENTA),
    fetchRange(spreadsheetId, apiKey, RANGE_OPERACIONES),
    fetchRange(spreadsheetId, apiKey, RANGE_VAR_HOY),
  ]);

  return { totalCuenta, operaciones, varHoy };
}
