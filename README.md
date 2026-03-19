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

Then, run the following command to initialize and start Supabase:

```bash
npx supabase init
npx supabase start
```

To stop Supabase, run the following command:

```bash
npx supabase stop --no-backup
```
