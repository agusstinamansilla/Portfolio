export type Holding = {
  simbolo: string;
  empresa: string;
  cantidad: number;
  precioActual: number;
  precioCompra: number;
  valorActual: number;
  valorCompra: number;
  ganancia: number;
  variacion: number; // fraction, e.g. 0.348 = 34.8%
  pctCartera: number | null; // fraction
  comentario?: string;
};

export type ResultadoPeriodo = {
  label: string;
  valorInicio: number | null;
  valorFin: number | null;
  ganancia: number | null;
  variacion: number | null; // fraction
};

export type Resumen = {
  activos: number | null;
  efectivo: number | null;
  pctEfectivo: number | null;
  total: number | null;
};

export type Operacion = {
  fecha: string;
  tipo: string; // COMPRA / VENTA
  accion: string;
  cantidad: number;
  precio: number;
  total: number;
};

export type PortfolioData = {
  updatedAt: string;
  acciones: Holding[];
  etfs: Holding[];
  resumen: Resumen;
  resultados: ResultadoPeriodo[];
  operaciones: Operacion[];
  warnings: string[];
};
