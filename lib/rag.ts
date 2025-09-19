import { DocumentType } from "./document_types";
import { prompt } from "./prompt";
export type Chunk = {
  content: string;
  tokens: number;
};

export type Retrieved = {
  id: string;
  content: string;
  source: string;
  score: number;
  sourceType?: DocumentType;
  fileUrl?: string;
};

export type Citation = {
  id: string;
  source: string;
  preview: string;
  score: number;
  sourceType?: DocumentType;
  fileUrl?: string;
};

function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}

export function chunkText(
  text: string,
  maxTokens = 700,
  overlapTokens = 80
): Chunk[] {
  const parts: Chunk[] = [];
  const paras = text
    .split(/\n{2,}/g)
    .map((p) => p.trim())
    .filter(Boolean);
  let buf: string[] = [];
  let acc = 0;
  const flush = (force = false) => {
    if (!buf.length) return;
    if (!force && acc < maxTokens) return;
    const content = buf.join("\n\n");
    parts.push({ content, tokens: estimateTokens(content) });
    const keepChars = Math.floor(overlapTokens * 4);
    const tail = content.slice(Math.max(0, content.length - keepChars));
    buf = tail ? [tail] : [];
    acc = estimateTokens(tail);
  };
  for (const p of paras) {
    const t = estimateTokens(p);
    if (acc + t > maxTokens && acc > 0) flush(true);
    buf.push(p);
    acc += t;
  }
  if (buf.length) flush(true);
  if (parts.length === 0 && text.trim())
    parts.push({ content: text.trim(), tokens: estimateTokens(text) });
  return parts;
}

export function buildRagPrompt(params: {
  question: string;
  context: Retrieved[];
}) {
  const { question, context } = params;
  const contextBlock = context
    .map((c, i) => `[${i + 1}] ${c.content}`)
    .join("\n\n");
  const messages = [
    {
      role: "system" as const,
      content: prompt.rag_prompt,
    },
    {
      role: "user" as const,
      content: `Context:\n${
        contextBlock || "(no context)"
      }\n\nQuestion: ${question}`,
    },
  ];
  console.log("RAG prompt", messages);
  return { messages };
}

export function textFromParsedDocument(doc: { type?: DocumentType; metadata?: string; content: unknown }): string {
  // @TODO: use titoken?
  try {
    const header = `${doc.type?.toString?.() || "unknown"}\n${
      doc.metadata || ""
    }`.trim();
    const body =
      typeof doc.content === "string"
        ? doc.content
        : JSON.stringify(doc.content, null, 2);
    return [header, body].filter(Boolean).join("\n\n");
  } catch {
    return "";
  }
}
