"use client";

import { PageShell } from "@/components/PageShell";
import { VariacionesHoyTable } from "@/components/VariacionesHoyTable";

export default function VariacionesHoyPage() {
  return (
    <PageShell active="variaciones">
      {() => <VariacionesHoyTable />}
    </PageShell>
  );
}
