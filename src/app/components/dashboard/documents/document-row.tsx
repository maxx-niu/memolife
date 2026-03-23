"use client";

import { FileText, FileType, Clock } from "lucide-react";
import type { Database } from "@/types/database.types";
import { DocumentStatusBadge } from "./document-status-badge";

type Document = Database["public"]["Tables"]["documents"]["Row"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DocumentRow({
  doc,
  onClick,
}: {
  doc: Document;
  onClick: () => void;
}) {
  const ext = doc.file_name.split(".").pop()?.toLowerCase() ?? "";

  return (
    <li>
      <button
        onClick={onClick}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
          <FileText className="size-4 text-muted-foreground" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {doc.file_name}
          </p>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileType className="size-3" aria-hidden />
              {ext.toUpperCase()}
            </span>
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" aria-hidden />
              {formatDate(doc.created_at)}
            </span>
          </div>
        </div>
        <DocumentStatusBadge docId={doc.id} initialStatus={doc.status} />
      </button>
    </li>
  );
}
