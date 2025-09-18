"use server";

import OpenAI from "openai";
import { Prisma, PrismaClient } from "@prisma/client";
import crypto from "node:crypto";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const EMBEDDING_MODEL = "text-embedding-3-small"; // 1536 dims
const GENERATION_MODEL = "gpt-4o-mini";

export type Chunk = {
  content: string;
  tokens: number;
  source?: string;
  metadata?: Record<string, any>;
};

export type Retrieved = {
  id: string;
  content: string;
  source: string | null;
  score: number;
};

export type Citation = {
  id: string;
  source?: string | null;
  preview: string;
  score: number;
};

function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}

export function chunkText(text: string, maxTokens = 700, overlapTokens = 80): Chunk[] {
  const parts: Chunk[] = [];
  const paras = text.split(/\n{2,}/g).map((p) => p.trim()).filter(Boolean);
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
  if (parts.length === 0 && text.trim()) parts.push({ content: text.trim(), tokens: estimateTokens(text) });
  return parts;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (!texts.length) return [];
  const res = await openai.embeddings.create({ model: EMBEDDING_MODEL, input: texts });
  return res.data.map((d) => d.embedding);
}

export async function embedQuery(query: string): Promise<number[]> {
  const [v] = await embedTexts([query]);
  return v || [];
}

function hashContent(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

// Build a SQL fragment for a pgvector literal: ARRAY[...]::vector
function vectorSql(vec: number[]) {
  return Prisma.sql`ARRAY[${Prisma.join(vec)}]::vector`;
}

export async function upsertChunksPg(params: {
  userId: string;
  fileId?: string;
  source?: string;
  chunks: Chunk[];
}) {
  const { userId, fileId, source, chunks } = params;
  if (!chunks.length) return;
  const embeddings = await embedTexts(chunks.map((c) => c.content));

  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i];
      const contentHash = hashContent(c.content);

      const row = await tx.documentChunk.upsert({
        where: { contentHash },
        update: {
          userId,
          fileId,
          source: c.source ?? source,
          content: c.content,
          tokens: c.tokens,
          metadata: c.metadata ?? undefined,
        },
        create: {
          userId,
          fileId,
          source: c.source ?? source,
          content: c.content,
          tokens: c.tokens,
          contentHash,
          metadata: c.metadata ?? undefined,
        },
        select: { id: true },
      });

      const vec = vectorSql(embeddings[i]);
      await tx.$executeRaw(Prisma.sql`update document_chunks set embedding = ${vec} where id = ${row.id}`);
    }
  });
}

export async function indexParsedDocumentPg(params: {
  userId: string;
  fileId?: string;
  source?: string;
  text: string;
}) {
  const chunks = chunkText(params.text);
  await upsertChunksPg({ ...params, chunks });
}

export async function searchSimilarChunksPg(params: {
  userId: string;
  query: string;
  k?: number;
}): Promise<Retrieved[]> {
  const { userId, query, k = 8 } = params;
  const q = await embedQuery(query);
  const vec = vectorSql(q);

  const rows = await prisma.$queryRaw<{
    id: string;
    content: string;
    source: string | null;
    score: number;
  }[]>(
    Prisma.sql`
      select id, content, source,
             1 - (embedding <=> ${vec}) as score
      from document_chunks
      where "userId" = ${userId}
      order by embedding <=> ${vec}
      limit ${k};
    `
  );

  return rows.map((r) => ({ id: r.id, content: r.content, source: r.source, score: Number(r.score) }));
}

export function buildRagPrompt(params: { question: string; context: Retrieved[] }) {
  const { question, context } = params;
  const contextBlock = context.map((c, i) => `[${i + 1}] ${c.content}`).join("\n\n");
  const messages = [
    {
      role: "system" as const,
      content:
        "You are a precise assistant. Answer strictly from the provided context. If missing, say you don't know. Cite snippets with [n] and list Sources.",
    },
    { role: "user" as const, content: `Context:\n${contextBlock || "(no context)"}\n\nQuestion: ${question}` },
  ];
  return { messages };
}

export async function answerWithRagPg(params: { userId: string; question: string; k?: number }) {
  const { userId, question, k = 8 } = params;
  const context = await searchSimilarChunksPg({ userId, query: question, k });
  const { messages } = buildRagPrompt({ question, context });
  const completion = await openai.chat.completions.create({ model: GENERATION_MODEL, messages, temperature: 0.2 });
  const answer = completion.choices[0]?.message?.content?.trim() ?? "";
  const citations: Citation[] = context.map((c) => ({ id: c.id, source: c.source ?? undefined, preview: c.content.slice(0, 240), score: c.score }));
  return { answer, citations, used: context };
}

