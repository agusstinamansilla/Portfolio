"use client";

import { PageShell } from "@/components/PageShell";
import { NoticiasList } from "@/components/NoticiasList";

export default function NoticiasPage() {
  return (
    <PageShell active="noticias">
      {() => <NoticiasList />}
    </PageShell>
  );
}
