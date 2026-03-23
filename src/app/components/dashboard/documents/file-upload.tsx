"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const EXTENSION_MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".md": "text/markdown",
};

function getExtension(name: string): string {
  const dot = name.toLowerCase().lastIndexOf(".");
  return dot === -1 ? "" : name.toLowerCase().slice(dot);
}

function isAllowedFile(file: File): boolean {
  return getExtension(file.name) in EXTENSION_MIME;
}

function getMimeType(file: File): string {
  return EXTENSION_MIME[getExtension(file.name)] ?? "application/octet-stream";
}

/**
 * FileUpload is a component that allows the user to upload a file to the dashboard.
 * It uses the upload API route to upload the file to the database.
 * It also automatically reloads server components to show the new document.
 * @returns A form that allows the user to upload a file to the dashboard.
 */

export default function FileUpload() {
  const router = useRouter();
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
      setError(`Only ${Object.keys(EXTENSION_MIME).join(", ")} files are supported.`);
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

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("User not found.");
        return;
      }

      const file_path = `${user.id}/${selected.name}`;
      const formData = new FormData();
      formData.append("file", selected);
      formData.append("file_name", selected.name);
      formData.append("file_type", getMimeType(selected));
      formData.append("file_path", file_path);

      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
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
      router.refresh(); // Refresh the dashboard page to show the new document
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
