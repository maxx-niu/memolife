Application Overview:
MemoLife is a Retrieval-Augmented Generation (RAG) application designed to ingest, query, and index personal documents (PDFs, files, notes, etc.). It is designed to provide answers to users based strictly on their uploaded data.

Functional Requirements:
File support: the app should support .pdf, .txt, and .md files
Search: the user needs to be able to retrieve and find relevant context without exact keyword matches, using natural language
The app needs to answer user queries about their data in concise, natural language
Isolation: the app may only query documents that strictly belong to a unique user

First, run

```bash
npm install
```

to install the dependencies.

## Getting Started

First, run the development server:

```bash
npm run dev
```

This will automatically start Docker Desktop if it isn't running, then start Supabase locally and the Next.js dev server.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To stop Supabase when you're done:

```bash
npx supabase stop --no-backup
```

## Supabase development workflow

1. Make schema changes locally (create tables, add RLS policies, etc.)
2. Run the sync script to generate a migration and push it to production:

```bash
npm run supabase:sync -- describe_the_change
```

This generates a migration file from your local schema diff and pushes it to production. It does **not** reset your local database by default — pass `--reset` if you want to replay all migrations from scratch:

```bash
npm run supabase:sync -- describe_the_change --reset
```

3. Commit the migration files to git
