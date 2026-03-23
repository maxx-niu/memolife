set -e

if ! docker info > /dev/null 2>&1; then
  echo "→ Starting Docker Desktop..."

  case "$(uname -s)" in
    Darwin)
      open -a "Docker" || { echo "Docker Desktop not found. Please start it manually."; exit 1; }
      ;;
    MINGW*|CYGWIN*|MSYS*)
      DOCKER_PATH=""
      for candidate in \
        "/c/Program Files/Docker/Docker/Docker Desktop.exe" \
        "/c/Program Files (x86)/Docker/Docker/Docker Desktop.exe" \
        "$LOCALAPPDATA/Docker/Docker Desktop.exe"; do
        if [ -f "$candidate" ]; then
          DOCKER_PATH="$candidate"
          break
        fi
      done
      if [ -z "$DOCKER_PATH" ]; then
        echo "Docker Desktop not found. Please start it manually."
        exit 1
      fi
      "$DOCKER_PATH" &
      ;;
    *)
      echo "Unsupported OS. Please start Docker manually."
      exit 1
      ;;
  esac

  echo "→ Waiting for Docker..."
  until docker info > /dev/null 2>&1; do
    sleep 2
  done
  echo "→ Docker is ready."
fi

npx supabase stop --no-backup && npx supabase start && next dev