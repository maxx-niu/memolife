import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentList } from "./document-list";

/**
 * FileList is a (server) component that fetches the user's documents and passes
 * them to the interactive DocumentList client component.
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
          <DocumentList documents={documents} />
        )}
      </CardContent>
    </Card>
  );
}
