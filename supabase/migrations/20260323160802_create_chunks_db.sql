create extension if not exists "vector" with schema "public";

create table "public"."chunks" (
  "id" uuid not null default gen_random_uuid(),
  "document_id" uuid not null,
  "user_id" uuid not null,
  "content" text not null,
  "chunk_index" bigint not null,
  "embedding" public.vector(1536) not null
);

alter table "public"."chunks" enable row level security;

CREATE UNIQUE INDEX chunks_pkey ON public.chunks USING btree (id);

alter table "public"."chunks" add constraint "chunks_pkey" PRIMARY KEY using index "chunks_pkey";

alter table "public"."chunks" add constraint "chunks_document_id_fkey" FOREIGN KEY (document_id) REFERENCES public.documents(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."chunks" validate constraint "chunks_document_id_fkey";

alter table "public"."chunks" add constraint "chunks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."chunks" validate constraint "chunks_user_id_fkey";

-- RLS policies
create policy "Users can view own chunks"
  on public.chunks for select
  using (auth.uid() = user_id);

create policy "Users can insert own chunks"
  on public.chunks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own chunks"
  on public.chunks for delete
  using (auth.uid() = user_id);

-- Grants (authenticated users and service roles only)
grant select, insert, delete on table "public"."chunks" to "authenticated";
grant all on table "public"."chunks" to "postgres";
grant all on table "public"."chunks" to "service_role";
