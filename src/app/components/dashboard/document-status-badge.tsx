"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Database } from "@/types/database.types";

type DocumentStatus = Database["public"]["Enums"]["document_status"];

const STATUS_STYLES: Record<DocumentStatus, string> = {
  processing:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  ready: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

/**
 * DocumentStatusBadge is a component that displays the status of a document in real-time, by subscribing to the document status changes in the database.
 * @param docId - The id of the document.
 * @param initialStatus - The initial status of the document.
 * @returns A badge with the status of the document.
 */

export function DocumentStatusBadge({
  docId,
  initialStatus,
}: {
  docId: string;
  initialStatus: DocumentStatus;
}) {
  const [status, setStatus] = useState<DocumentStatus>(initialStatus);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`document-status-${docId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "documents",
          filter: `id=eq.${docId}`,
        },
        (payload) => {
          const newStatus = (payload.new as { status: DocumentStatus }).status;
          if (newStatus) setStatus(newStatus);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [docId]);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
