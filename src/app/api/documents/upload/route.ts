import { createClient } from "@/utils/supabase/server";

type UploadRequest = {
  file: File;
  file_name: File["name"];
  file_type: File["type"];
  file_path: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { file, file_name, file_type, file_path } = body as UploadRequest;
    if (!file || !file_name || !file_type || !file_path) {
      return Response.json(
        { error: "File, file name, file type, and file path are required" },
        { status: 400 },
      );
    }
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

    const { error } = await supabase.from("documents").insert({
      user_id,
      file_name,
      file_type,
      file_path,
    });
    if (error)
      return Response.json(
        { error: "Failed to upload document: " + error.message },
        { status: 500 },
      );
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
