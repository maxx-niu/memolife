import { FileText, FileType, Clock } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

function DocumentRow({ doc }: { doc: Document }) {
  const ext = doc.file_name.split(".").pop()?.toLowerCase() ?? "";

  return (
    <li className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50">
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
    </li>
  );
}

/**
 * FileList is a (server) component that displays the list of documents that belong to the current user in the dashboard.
 * @returns A list of documents.
 */

export default async function FileList() {
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from("documents")
    .select("id, file_name, file_type, file_path, status, created_at, user_id")
    .order("created_at", { ascending: false });

  return (
    <Card className="mt-8 w-full max-w-md">
      <CardHeader>
        <CardTitle>Your documents</CardTitle>
      </CardHeader>
      <CardContent>
        {!documents?.length ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No documents yet. Upload one above.
          </p>
        ) : (
          <ul className="-mx-1 divide-y divide-border/50">
            {documents.map((doc) => (
              <DocumentRow key={doc.id} doc={doc} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
