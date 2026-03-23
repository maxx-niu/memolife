import { createClient } from "@/utils/supabase/server";

/**
 * This route is used to get the signed URL for a document that can be used to retrieves the document from the storage. The URL is valid for 5 minutes.
 * GET /api/documents/[id]/url
 * @param _request - The request object
 * @param params - The parameters object
 * @returns The signed URL for the document
 */

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("file_path")
    .eq("id", id)
    .single();

  if (docError || !doc) {
    return Response.json({ error: "Document not found" }, { status: 404 });
  }

  const { data: signedData, error: signedError } = await supabase.storage
    .from("documents")
    .createSignedUrl(doc.file_path, 60 * 5); // 5-minute expiry

  if (signedError || !signedData) {
    return Response.json({ error: "Could not generate URL" }, { status: 500 });
  }

  return Response.json({ url: signedData.signedUrl });
}
