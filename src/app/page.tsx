"use client";

import { PageShell } from "@/components/PageShell";
import { SummaryStrip } from "@/components/SummaryStrip";
import { PersonasTable } from "@/components/PersonasTable";

export default function ResumenPage() {
  return (
    <PageShell active="resumen">
      {(data) => (
        <>
          <SummaryStrip resumen={data.resumen} resultados={data.resultados} />
          <PersonasTable personas={data.personasPrimerSemestre} />
        </>
      )}
    </PageShell>
  );
}
