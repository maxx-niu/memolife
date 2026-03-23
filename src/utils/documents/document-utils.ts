import { PDFParse } from "pdf-parse";

const SEPARATORS = ["\n\n", "\n", ". ", " "];

export async function extractText(
  buffer: Buffer,
  fileType: string,
): Promise<string> {
  if (fileType === "pdf") {
    const parser = new PDFParse(buffer);
    const result = await parser.getText();
    return result.text;
  }
  // txt, md — already plain text
  return buffer.toString("utf-8");
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
