import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
import OpenAI from "openai";

// Point to the actual worker file for Node.js
GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.mjs",
  import.meta.url,
).toString();

const SEPARATORS = ["\n\n", "\n", ". ", " "];

export async function extractText(
  buffer: Buffer,
  fileType: string,
): Promise<string> {
  let text: string;
  if (fileType === "pdf" || fileType === "application/pdf") {
    const pdf = await getDocument({ data: new Uint8Array(buffer) }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      pages.push(
        content.items
          .filter((item) => "str" in item)
          .map((item) => (item as { str: string }).str)
          .join(" "),
      );
    }
    text = pages.join("\n\n");
  } else {
    text = buffer.toString("utf-8");
  }
  return text.replace(/\0/g, "");
}

export function chunkText(
  text: string,
  chunkSize: number = 800,
  overlap: number = 150,
): { content: string; chunkIndex: number }[] {
  const chunks: string[] = [];
  splitRecursive(text, chunkSize, 0, chunks);

  // Add overlap between consecutive chunks
  const result = chunks.map((chunk, i) => {
    if (i === 0) return { content: chunk.trim(), chunkIndex: i };

    // Prepend the tail of the previous chunk as overlap
    const prev = chunks[i - 1];
    const overlapText = prev.slice(-overlap);
    return { content: (overlapText + chunk).trim(), chunkIndex: i };
  });

  return result.filter((c) => c.content.length > 0);
}

function splitRecursive(
  text: string,
  chunkSize: number,
  separatorIndex: number,
  chunks: string[],
) {
  if (text.length <= chunkSize) {
    chunks.push(text);
    return;
  }

  const separator = SEPARATORS[separatorIndex];

  // Last resort: hard split by character
  if (separatorIndex >= SEPARATORS.length) {
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return;
  }

  const parts = text.split(separator);
  let current = "";

  for (const part of parts) {
    const candidate = current ? current + separator + part : part;

    if (candidate.length > chunkSize) {
      if (current) chunks.push(current);
      // If a single part is still too big, split it with the next separator
      if (part.length > chunkSize) {
        splitRecursive(part, chunkSize, separatorIndex + 1, chunks);
      } else {
        current = part;
      }
    } else {
      current = candidate;
    }
  }

  if (current) chunks.push(current);
}

const EMBEDDING_BATCH_SIZE = 100;

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const embeddings: number[][] = [];
  for (let i = 0; i < texts.length; i += EMBEDDING_BATCH_SIZE) {
    const batch = texts.slice(i, i + EMBEDDING_BATCH_SIZE);
    const result = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: batch,
    });
    embeddings.push(...result.data.map((d) => d.embedding));
  }

  return embeddings;
}
