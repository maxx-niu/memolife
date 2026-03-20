"use client";

import { useState } from "react";
import { Search, ArrowUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // TODO: replace with real RAG API call
      // const res = await fetch("/api/search", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ query: trimmed }),
      // });
      // if (!res.ok) throw new Error(await res.text());
      // const { answer } = await res.json();
      // setResult(answer);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      setResult(
        "This is a placeholder response. Connect your RAG pipeline to get real answers from your documents.",
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything about your documents..."
          className="h-12 w-full rounded-xl border border-input bg-transparent pl-10 pr-12 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!query.trim() || loading}
          className="absolute right-2 top-1/2 size-8 -translate-y-1/2 rounded-lg"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowUp className="size-4" />
          )}
        </Button>
      </form>
      {error && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}
      {result && (
        <div className="rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-card-foreground">
          {result}
        </div>
      )}
    </div>
  );
}
