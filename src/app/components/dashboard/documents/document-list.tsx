"use client";

import { useState } from "react";
import type { Database } from "@/types/database.types";
import { DocumentRow } from "./document-row";
import { DocumentPanel } from "./document-panel";

type Document = Database["public"]["Tables"]["documents"]["Row"];

export function DocumentList({ documents }: { documents: Document[] }) {
  const [selected, setSelected] = useState<Document | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  function openDoc(doc: Document) {
    setSelected(doc);
    setPanelOpen(true);
  }

  return (
    <>
      <ul className="-mx-1 divide-y divide-border/50">
        {documents.map((doc) => (
          <DocumentRow key={doc.id} doc={doc} onClick={() => openDoc(doc)} />
        ))}
      </ul>
      <DocumentPanel
        doc={selected}
        open={panelOpen}
        onOpenChange={setPanelOpen}
      />
    </>
  );
}
