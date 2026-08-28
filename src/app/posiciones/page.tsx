"use client";

import { PageShell } from "@/components/PageShell";
import { HoldingsTable } from "@/components/HoldingsTable";

export default function PosicionesPage() {
  return (
    <PageShell active="posiciones">
      {(data) => (
        <>
          <HoldingsTable title="Acciones" subtitle={`${data.acciones.length} posiciones`} holdings={data.acciones} />
          <HoldingsTable title="ETFs" subtitle={`${data.etfs.length} posiciones`} holdings={data.etfs} />
        </>
      )}
    </PageShell>
  );
}
