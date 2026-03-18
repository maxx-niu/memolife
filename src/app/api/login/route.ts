import { createClient } from "@/utils/supabase/server";

type LoginRequest = {
  email: string;
  password: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { email, password } = body as LoginRequest;
    if (!email || !password) {
      return Response.json(
        { error: "Email and password required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error)
      return Response.json({ error: error.message }, { status: error.status });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
