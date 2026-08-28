import { Holding, Operacion, PortfolioData, ResultadoPeriodo, Resumen } from "./types";

type Cell = string | number | null | undefined;
type Grid = Cell[][];

function norm(v: Cell): string {
  return String(v ?? "").trim();
}

function normKey(v: Cell): string {
  return norm(v)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // strip accents
}

/**
 * With valueRenderOption=UNFORMATTED_VALUE the Sheets API already returns numeric
 * cells as real JS numbers. This only accepts a real number, or a string that is
 * ENTIRELY a number (never digits embedded in a label like "al 4%"), so label
 * cells never get misread as data.
 */
function toNumber(v: Cell): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (v === null || v === undefined || v === "") return null;
  const s = String(v).trim();
  if (!/^-?[\d.,]+%?$/.test(s)) return null;
  const n = Number(s.replace(/%$/, "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** Finds the row index where a cell (searched across the first few columns) matches one of the given keys. */
function findRow(grid: Grid, keys: string[], fromRow = 0, maxCol = 12): number {
  for (let r = fromRow; r < grid.length; r++) {
    for (let c = 0; c < Math.min(maxCol, grid[r]?.length ?? 0); c++) {
      const k = normKey(grid[r][c]);
      if (keys.some((needle) => k.includes(needle))) return r;
    }
  }
  return -1;
}

function findCol(row: Cell[], keys: string[]): number {
  for (let c = 0; c < row.length; c++) {
    const k = normKey(row[c]);
    if (keys.some((needle) => k.includes(needle))) return c;
  }
  return -1;
}

function isRowEmpty(row: Cell[] | undefined): boolean {
  if (!row) return true;
  return row.every((c) => norm(c) === "");
}

/**
 * Reads a holdings block (ACCIONES or ETFs) starting at its header row.
 * Column positions are detected by header text, not fixed indices, so
 * reordering or inserting columns upstream doesn't silently break this.
 */
function parseHoldingsBlock(grid: Grid, headerRow: number, warnings: string[], label: string): Holding[] {
  const header = grid[headerRow] ?? [];
  const col = {
    simbolo: findCol(header, ["simbolo"]),
    empresa: findCol(header, ["empresa"]),
    cantidad: findCol(header, ["cantidad"]),
    precioActual: findCol(header, ["precio actual"]),
    precioCompra: findCol(header, ["precio de compra", "precio promedio compra", "precio compra"]),
    valorActual: findCol(header, ["valor actual", "valor total"]),
    valorCompra: findCol(header, ["valor de compra", "valor dede compra", "valor compra"]),
    ganancia: findCol(header, ["ganancia"]),
    variacion: findCol(header, ["variacion"]),
    pctCartera: findCol(header, ["% de la cartera", "de la cartera"]),
    comentario: findCol(header, ["comentario"]),
  };

  if (col.simbolo === -1) {
    warnings.push(`No encontre la columna "Simbolo" en el bloque ${label} (fila ${headerRow + 1}).`);
    return [];
  }

  const out: Holding[] = [];
  for (let r = headerRow + 1; r < grid.length; r++) {
    const row = grid[r] ?? [];
    const simbolo = norm(row[col.simbolo]);
    if (isRowEmpty(row)) break; // end of block
    if (!simbolo) continue;

    const valorActual = (col.valorActual !== -1 ? toNumber(row[col.valorActual]) : null) ?? 0;
    const valorCompra = (col.valorCompra !== -1 ? toNumber(row[col.valorCompra]) : null) ?? 0;
    const ganancia = (col.ganancia !== -1 ? toNumber(row[col.ganancia]) : null) ?? valorActual - valorCompra;
    const variacionRaw = col.variacion !== -1 ? toNumber(row[col.variacion]) : null;
    const variacion = variacionRaw ?? (valorCompra ? ganancia / valorCompra : 0);

    out.push({
      simbolo,
      empresa: col.empresa !== -1 ? norm(row[col.empresa]) : "",
      cantidad: (col.cantidad !== -1 ? toNumber(row[col.cantidad]) : null) ?? 0,
      precioActual: (col.precioActual !== -1 ? toNumber(row[col.precioActual]) : null) ?? 0,
      precioCompra: (col.precioCompra !== -1 ? toNumber(row[col.precioCompra]) : null) ?? 0,
      valorActual,
      valorCompra,
      ganancia,
      variacion,
      pctCartera: col.pctCartera !== -1 ? toNumber(row[col.pctCartera]) : null,
      comentario: col.comentario !== -1 ? norm(row[col.comentario]) || undefined : undefined,
    });
  }
  return out;
}

function parseResultadoBlock(grid: Grid, startRow: number, label: string): ResultadoPeriodo | null {
  // Looks a few rows below a "RESULTADO ..." title for valor inicial / valor final / ganancia rows.
  let valorInicio: number | null = null;
  let valorFin: number | null = null;
  let ganancia: number | null = null;
  let variacion: number | null = null;

  for (let r = startRow; r < Math.min(startRow + 6, grid.length); r++) {
    const row = grid[r] ?? [];
    const rowKey = row.map(normKey).join(" | ");
    const numsInRow = row.map(toNumber).filter((n): n is number => n !== null);
    if (rowKey.includes("valor al inicio") || rowKey.includes("valor al inciar")) {
      valorInicio = numsInRow[0] ?? valorInicio;
    } else if (rowKey.includes("fin de primer") || rowKey.includes("valor actual")) {
      valorFin = numsInRow[0] ?? valorFin;
    } else if (rowKey.includes("ganancia")) {
      ganancia = numsInRow[0] ?? ganancia;
      variacion = numsInRow[1] ?? variacion;
      break; // "Ganancia" is always the last line of a block — stop before the next block's rows
    }
  }

  if (valorInicio === null && valorFin === null && ganancia === null) return null;
  return { label, valorInicio, valorFin, ganancia, variacion };
}

export function parseTotalCuenta(grid: Grid, warnings: string[]): {
  acciones: Holding[];
  etfs: Holding[];
  resumen: Resumen;
  resultados: ResultadoPeriodo[];
} {
  const accionesHeader = findRow(grid, ["simbolo"], 0);
  const acciones = accionesHeader !== -1 ? parseHoldingsBlock(grid, accionesHeader, warnings, "ACCIONES") : [];

  const etfHeader = findRow(grid, ["simbolo"], accionesHeader + 1);
  const etfs = etfHeader !== -1 ? parseHoldingsBlock(grid, etfHeader, warnings, "ETFs") : [];

  const posicionRow = findRow(grid, ["posicion actual"], etfHeader + 1);
  let activos: number | null = null;
  let efectivo: number | null = null;
  let pctEfectivo: number | null = null;
  let total: number | null = null;

  if (posicionRow !== -1) {
    for (let r = posicionRow; r < Math.min(posicionRow + 4, grid.length); r++) {
      const row = grid[r] ?? [];
      const rowKey = row.map(normKey).join(" | ");
      const nums = row.map(toNumber).filter((n): n is number => n !== null);
      if (rowKey.includes("activos")) activos = nums[0] ?? activos;
      if (rowKey.includes("efectivo")) {
        efectivo = nums[0] ?? efectivo;
        pctEfectivo = nums[1] ?? pctEfectivo;
      }
      if (rowKey.includes("total")) total = nums[0] ?? total;
    }
  } else {
    warnings.push('No encontre la seccion "POSICION ACTUAL" en Total cuenta.');
  }

  const resultados: ResultadoPeriodo[] = [];
  const labels = [
    { needle: "resultado primer semestre", label: "Primer semestre" },
    { needle: "resultado segundo trimestre", label: "Segundo trimestre" },
    { needle: "resultado ano acumulado", label: "Año acumulado" },
  ];
  let cursor = posicionRow !== -1 ? posicionRow : 0;
  for (const { needle, label } of labels) {
    const row = findRow(grid, [needle], cursor);
    if (row !== -1) {
      const block = parseResultadoBlock(grid, row, label);
      if (block) resultados.push(block);
      cursor = row + 1;
    }
  }

  return { acciones, etfs, resumen: { activos, efectivo, pctEfectivo, total }, resultados };
}

export function parseOperaciones(grid: Grid, warnings: string[]): Operacion[] {
  const headerRow = findRow(grid, ["operacion"], 0);
  if (headerRow === -1) {
    warnings.push('No encontre el encabezado "OPERACION" en la hoja operaciones.');
    return [];
  }
  const header = grid[headerRow] ?? [];
  const opCol = findCol(header, ["operacion"]);
  const fechaCol = opCol - 1 >= 0 ? opCol - 1 : findCol(header, ["fecha"]);
  const accionCol = findCol(header, ["accion"]);
  const cantidadCol = findCol(header, ["cantidad"]);
  const precioCol = findCol(header, ["precio"]);

  const out: Operacion[] = [];
  for (let r = headerRow + 1; r < grid.length; r++) {
    const row = grid[r] ?? [];
    if (isRowEmpty(row)) continue;
    const tipo = norm(row[opCol]);
    const accion = accionCol !== -1 ? norm(row[accionCol]) : "";
    if (!tipo && !accion) continue;
    const cantidad = (cantidadCol !== -1 ? toNumber(row[cantidadCol]) : null) ?? 0;
    const precio = (precioCol !== -1 ? toNumber(row[precioCol]) : null) ?? 0;
    out.push({
      fecha: fechaCol !== -1 ? norm(row[fechaCol]) : "",
      tipo,
      accion,
      cantidad,
      precio,
      total: cantidad * precio,
    });
  }
  // Most recent first
  return out.reverse();
}

export function buildPortfolioData(totalCuentaGrid: Grid, operacionesGrid: Grid): PortfolioData {
  const warnings: string[] = [];
  const { acciones, etfs, resumen, resultados } = parseTotalCuenta(totalCuentaGrid, warnings);
  const operaciones = parseOperaciones(operacionesGrid, warnings);

  // Fill in % de cartera when the sheet didn't have that column for a block (e.g. ETFs),
  // now that we know the portfolio total.
  if (resumen.total) {
    for (const h of [...acciones, ...etfs]) {
      if (h.pctCartera === null) h.pctCartera = h.valorActual / (resumen.total as number);
    }
  }

  return {
    updatedAt: new Date().toISOString(),
    acciones,
    etfs,
    resumen,
    resultados,
    operaciones,
    warnings,
  };
}
