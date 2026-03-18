import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-xl font-semibold">Memolife</h1>
      {user ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          Signed in as {user.email}
        </p>
      ) : (
        <p className="text-zinc-600 dark:text-zinc-400">
          Not signed in
        </p>
      )}
    </div>
  );
}
