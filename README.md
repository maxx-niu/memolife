Application Overview:
MemoLife is a Retrieval-Augmented Generation (RAG) application designed to ingest, query, and index personal documents (PDFs, files, notes, etc.). It is designed to provide answers to users based strictly on their uploaded data.

Functional Requirements:
File support: the app should support .pdf, .txt, and .md files
Search: the user needs to be able to retrieve and find relevant context without exact keyword matches, using natural language
The app needs to answer user queries about their data in concise, natural language
Isolation: the app may only query documents that strictly belong to a unique user

First, run npm install to install the dependencies.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

For local development, you need to have Supabase running. Run the following command to start Supabase locally:

First, ensure Docker Desktop is installed and running.

Then, run the following command to start Supabase:

```bash
npx supabase start
```

To stop Supabase, run the following command:

```bash
npx supabase stop --no-backup
```

(Note if Supabase CLI is installed, you can run the commands above without the `npx` prefix.)

## Supabase development workflow

1. Make schema changes locally (create tables, add RLS policies, etc.)
2. Run `npx supabase db diff -f describe_the_change` to generate a migration file
3. Test locally with `npx supabase db reset` (replays all migrations from scratch)
4. Run `npx supabase db push` to apply pending migrations to production
5. Commit the migration files to git
