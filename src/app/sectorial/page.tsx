"use client";

import { PageShell } from "@/components/PageShell";
import { AnalisisSectorial } from "@/components/AnalisisSectorial";

export default function SectorialPage() {
  return (
    <PageShell active="sectorial">
      {(data) => <AnalisisSectorial data={data} />}
    </PageShell>
  );
}
