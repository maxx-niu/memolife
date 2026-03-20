"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ALLOWED_EXTENSIONS = new Set([".pdf", ".txt", ".md"]);

function isAllowedFile(file: File): boolean {
  const lower = file.name.toLowerCase();
  const dot = lower.lastIndexOf(".");
  if (dot === -1) return false;
  return ALLOWED_EXTENSIONS.has(lower.slice(dot));
}

export default function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pickFile = () => inputRef.current?.click();

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setMessage(null);
    setError(null);
    if (!file) {
      setSelected(null);
      return;
    }
    if (!isAllowedFile(file)) {
      setSelected(null);
      setError("Only .pdf, .txt, and .md files are supported.");
      e.target.value = "";
      return;
    }
    setSelected(file);
  };

  const registerDocument = async () => {
    if (!selected) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    const file_path = `pending/${crypto.randomUUID()}/${selected.name}`;

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: selected,
          file_name: selected.name,
          file_type: selected.type,
          file_path,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        success?: boolean;
      };

      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }

      setMessage("Document saved.");
      setSelected(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 flex w-full max-w-md flex-col gap-3">
      <p className="text-center text-sm font-medium text-foreground">
        Add a document
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
        className="hidden"
        onChange={onFileChange}
      />
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={pickFile}
          disabled={loading}
        >
          <FileUp className="mr-2 size-4" aria-hidden />
          Choose file
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={registerDocument}
          disabled={!selected || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              Saving…
            </>
          ) : (
            "Save to library"
          )}
        </Button>
      </div>
      {selected ? (
        <p className="text-center text-xs text-muted-foreground">
          Selected: {selected.name}
        </p>
      ) : null}
      {error ? (
        <p className="text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-center text-sm text-muted-foreground">{message}</p>
      ) : null}
    </div>
  );
}
