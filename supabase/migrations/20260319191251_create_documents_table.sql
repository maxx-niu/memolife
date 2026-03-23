create type "public"."document_status" as enum ('processing', 'ready', 'failed');


  create table "public"."documents" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "file_name" text not null,
    "file_type" text not null,
    "file_path" text not null,
    "status" public.document_status not null default 'processing'::public.document_status
      );


alter table "public"."documents" enable row level security;

CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id);

alter table "public"."documents" add constraint "documents_pkey" PRIMARY KEY using index "documents_pkey";

alter table "public"."documents" add constraint "documents_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."documents" validate constraint "documents_user_id_fkey";

grant delete on table "public"."documents" to "anon";

grant insert on table "public"."documents" to "anon";

grant references on table "public"."documents" to "anon";

grant select on table "public"."documents" to "anon";

grant trigger on table "public"."documents" to "anon";

grant truncate on table "public"."documents" to "anon";

grant update on table "public"."documents" to "anon";

grant delete on table "public"."documents" to "authenticated";

grant insert on table "public"."documents" to "authenticated";

grant references on table "public"."documents" to "authenticated";

grant select on table "public"."documents" to "authenticated";

grant trigger on table "public"."documents" to "authenticated";

grant truncate on table "public"."documents" to "authenticated";

grant update on table "public"."documents" to "authenticated";

grant delete on table "public"."documents" to "service_role";

grant insert on table "public"."documents" to "service_role";

grant references on table "public"."documents" to "service_role";

grant select on table "public"."documents" to "service_role";

grant trigger on table "public"."documents" to "service_role";

grant truncate on table "public"."documents" to "service_role";

grant update on table "public"."documents" to "service_role";


  create policy "Users can delete own documents"
  on "public"."documents"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own documents"
  on "public"."documents"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can view own documents"
  on "public"."documents"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can update own documents"
  on "public"."documents"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));

alter publication supabase_realtime add table documents;