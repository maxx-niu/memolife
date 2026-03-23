import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    // Validate the request body
    const body = await request.formData();
    const file = body.get("file") as File;
    const file_name = body.get("file_name") as string;
    const file_type = body.get("file_type") as string;
    const file_path = body.get("file_path") as string;

    if (!file || !file_name || !file_type || !file_path) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get the user from the database
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      return Response.json({ error: userError.message }, { status: 401 });
    }
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 401 });
    }
    const user_id = user.id;

    // Insert the document into the database
    const { data: insertData, error: insertError } = await supabase
      .from("documents")
      .insert({
        user_id,
        file_name,
        file_type,
        file_path,
        status: "processing",
      })
      .select("id")
      .single();
    if (insertError) {
      return Response.json(
        {
          error:
            "Failed to insert document into database: " + insertError.message,
        },
        { status: 500 },
      );
    }

    // Upload the file to the Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(file_path, file);

    if (uploadError) {
      await supabase
        .from("documents")
        .update({ status: "failed" })
        .eq("id", insertData.id);
      return Response.json(
        {
          error: "Failed to upload document to storage: " + uploadError.message,
        },
        { status: 500 },
      );
    }

    await supabase
      .from("documents")
      .update({ status: "ready" })
      .eq("id", insertData.id);
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
