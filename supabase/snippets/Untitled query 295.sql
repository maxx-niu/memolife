-- Enable RLS
alter table public.documents enable row level security;

-- Users can only see their own documents
create policy "Users can view own documents"
  on public.documents for select
  using (auth.uid() = user_id);

-- Users can only insert their own documents
create policy "Users can insert own documents"
  on public.documents for insert
  with check (auth.uid() = user_id);

-- Users can only delete their own documents
create policy "Users can delete own documents"
  on public.documents for delete
  using (auth.uid() = user_id);