import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";
import { promises as fs } from "fs";
import path from "path";

// Routes that live under (public) — no auth required.
// Next.js strips route-group parentheses from URLs, so we resolve
// which URLs are public by scanning the (public) folder at build time
// and caching the result.  At runtime the set is checked with a
// simple prefix match.

let publicPaths: Set<string> | null = null;

async function getPublicPaths(): Promise<Set<string>> {
  if (publicPaths) return publicPaths;

  const publicDir = path.join(
    process.cwd(),
    "src/app/(pages)/(public)",
  );

  const paths = new Set<string>();

  try {
    const entries = await fs.readdir(publicDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        paths.add(`/${entry.name}`);
      }
    }
  } catch {
    // Folder doesn't exist — no public routes
  }

  // API auth routes are always public
  paths.add("/api/auth");

  publicPaths = paths;
  return paths;
}

async function isPublicRoute(pathname: string): Promise<boolean> {
  const paths = await getPublicPaths();
  return [...paths].some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic = await isPublicRoute(pathname);

  // Authenticated users hitting public auth pages → dashboard
  if (user && isPublic && pathname !== "/api/auth") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated users hitting protected pages → login
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
