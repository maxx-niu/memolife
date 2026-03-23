"use client";

import { useEffect, useState } from "react";
import { FileText, Loader2, AlertCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { Database } from "@/types/database.types";
import { DocumentStatusBadge } from "./document-status-badge";

type Document = Database["public"]["Tables"]["documents"]["Row"];

type ContentState =
  | { kind: "idle" }
  | { kind: "text"; content: string }
  | { kind: "pdf"; url: string }
  | { kind: "error"; message: string };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function DocumentContent({
  doc,
  state,
}: {
  doc: Document;
  state: ContentState;
}) {
  if (state.kind === "idle") {
    return (
      <div className="flex flex-1 items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }
  if (state.kind === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-sm text-destructive">
        <AlertCircle className="size-5" />
        {state.message}
      </div>
    );
  }
  if (state.kind === "pdf") {
    return (
      <iframe
        src={state.url}
        title={doc.file_name}
        className="flex-1 rounded-md border"
        style={{ minHeight: "70vh" }}
      />
    );
  }
  return (
    <pre className="flex-1 overflow-auto rounded-md border bg-muted/40 p-4 text-xs leading-relaxed whitespace-pre-wrap wrap-break-words font-mono">
      {state.content}
    </pre>
  );
}

export function DocumentPanel({
  doc,
  open,
  onOpenChange,
}: {
  doc: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [contentState, setContentState] = useState<ContentState>({
    kind: "idle",
  });

  useEffect(() => {
    if (!open || !doc) return;

    let cancelled = false;

    async function load() {
      if (!doc) return;

      const res = await fetch(`/api/documents/${doc.id}/url`);
      if (cancelled) return;

      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        setContentState({
          kind: "error",
          message: json.error ?? "Failed to load document.",
        });
        return;
      }

      const { url } = (await res.json()) as { url: string };
      if (cancelled) return;

      if (doc.file_type === "application/pdf") {
        setContentState({ kind: "pdf", url });
        return;
      }

      const fileRes = await fetch(url);
      if (cancelled) return;
      if (!fileRes.ok) {
        setContentState({
          kind: "error",
          message: "Failed to fetch file content.",
        });
        return;
      }

      const text = await fileRes.text();
      if (!cancelled) setContentState({ kind: "text", content: text });
    }

    load().catch(() => {
      if (!cancelled)
        setContentState({ kind: "error", message: "Something went wrong." });
    });

    return () => {
      cancelled = true;
      setContentState({ kind: "idle" });
    };
  }, [open, doc]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col p-0">
        <SheetHeader className="border-b px-6 py-4">
          <div className="flex items-center gap-3 pr-8">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
              <FileText className="size-4 text-muted-foreground" aria-hidden />
            </div>
            <div className="min-w-0">
              <SheetTitle className="truncate text-sm">
                {doc?.file_name ?? ""}
              </SheetTitle>
              <SheetDescription className="mt-0.5 flex items-center gap-2 text-xs">
                {doc && formatDate(doc.created_at)}
                {doc && (
                  <DocumentStatusBadge
                    docId={doc.id}
                    initialStatus={doc.status}
                  />
                )}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-hidden px-6 py-4">
          {doc && <DocumentContent doc={doc} state={contentState} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}
