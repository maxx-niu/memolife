drop policy "Users can delete own documents" on "public"."documents";

drop policy "Users can insert own documents" on "public"."documents";

drop policy "Users can view own documents" on "public"."documents";

drop policy "Users can update own documents" on "public"."documents";


  create policy "Users can delete own documents"
  on "public"."documents"
  as permissive
  for delete
  to public
using (( SELECT (auth.uid() = documents.user_id)));



  create policy "Users can insert own documents"
  on "public"."documents"
  as permissive
  for insert
  to public
with check (( SELECT (auth.uid() = documents.user_id)));



  create policy "Users can view own documents"
  on "public"."documents"
  as permissive
  for select
  to public
using (( SELECT (auth.uid() = documents.user_id)));



  create policy "Users can update own documents"
  on "public"."documents"
  as permissive
  for update
  to public
using (( SELECT (auth.uid() = documents.user_id)));

-- Restrict updates to only the status column
revoke update on table "public"."documents" from "authenticated";
grant update (status) on table "public"."documents" to "authenticated";
