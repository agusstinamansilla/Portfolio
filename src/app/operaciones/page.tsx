"use client";

import { PageShell } from "@/components/PageShell";
import { OperacionesLog } from "@/components/OperacionesLog";

export default function OperacionesPage() {
  return (
    <PageShell active="operaciones">
      {(data) => <OperacionesLog operaciones={data.operaciones} />}
    </PageShell>
  );
}
