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
  tasaEfectivo: string | null; // e.g. "4%" — the stated remuneration rate, pulled from the label text
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

export type VariacionHoy = {
  simbolo: string;
  empresa: string;
  precioHoy: number | null;
  precioAyer: number | null;
  variacion: number | null; // fraction
};

export type VariacionesHoyData = {
  updatedAt: string;
  variaciones: VariacionHoy[];
  warnings: string[];
};

export type NoticiaItem = {
  simbolo: string;
  titulo: string;
  fuente: string;
  fecha: string; // ISO
  url: string;
};

export type NoticiasData = {
  updatedAt: string;
  noticias: NoticiaItem[];
  warnings: string[];
};

export type PersonaResultado = {
  persona: string;
  valorInicio: number | null;
  valorFin: number | null;
  ganancia: number | null;
  variacion: number | null; // fraction
};

export type PortfolioData = {
  updatedAt: string;
  acciones: Holding[];
  etfs: Holding[];
  resumen: Resumen;
  resultados: ResultadoPeriodo[];
  personasPrimerSemestre: PersonaResultado[];
  operaciones: Operacion[];
  warnings: string[];
};
