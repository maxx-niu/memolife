set -e

if [ -z "$1" ]; then
  echo "Usage: npm run supabase:sync -- <migration_name> [--reset]"
  exit 1
fi

MIGRATION_NAME="$1"
NO_RESET=true

for arg in "$@"; do
  if [ "$arg" = "--reset" ]; then
    NO_RESET=false
  fi
done

echo "→ Generating migration: $MIGRATION_NAME"
npx supabase db diff -f "$MIGRATION_NAME"

if [ "$NO_RESET" = true ]; then
  echo "→ Skipping local db reset (pass --reset to run it)"
else
  echo "→ Testing locally (db reset)"
  npx supabase db reset
fi

echo "→ Pushing to production"
npx supabase db push
