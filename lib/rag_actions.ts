"use server";
import { buildRagPrompt, Retrieved, Citation, Chunk, chunkText } from "./rag";
import OpenAI from "openai";
import { Prisma, PrismaClient } from "@prisma/client";
import crypto from "node:crypto";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const EMBEDDING_MODEL = "text-embedding-3-small"; // 1536 dims
const GENERATION_MODEL = "gpt-4o-mini";

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (!texts.length) return [];
  const res = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}

export async function embedQuery(query: string): Promise<number[]> {
  const [v] = await embedTexts([query]);
  return v || [];
}

export async function answerWithRagPg(params: {
  userId: string;
  question: string;
  k?: number;
}) {
  const { userId, question, k = 8 } = params; // @TODO make k configurable by user
  const context = await searchSimilarChunksPg({ userId, query: question, k });
  const { messages } = buildRagPrompt({ question, context });
  const completion = await openai.chat.completions.create({
    model: GENERATION_MODEL,
    messages,
    temperature: 0.2,
  });
  const answer = completion.choices[0]?.message?.content?.trim() ?? "";
  const citations: Citation[] = context.map((c) => ({
    id: c.id,
    source: c.source ?? undefined,
    preview: c.content.slice(0, 240),
    score: c.score,
  }));
  return { answer, citations, used: context };
}
export async function searchSimilarChunksPg(params: {
  userId: string;
  query: string;
  k?: number;
}): Promise<Retrieved[]> {
  const { userId, query, k = 8 } = params;
  const q = await embedQuery(query);
  const vec = vectorSql(q);

  const rows = await prisma.$queryRaw<
    {
      id: string;
      content: string;
      source: string | null;
      score: number;
    }[]
  >(
    Prisma.sql`
      select id, content, source,
             1 - (embedding <=> ${vec}) as score
      from document_chunks
      where "userId" = ${userId}
      order by embedding <=> ${vec}
      limit ${k};
    `
  );

  return rows.map((r) => ({
    id: r.id,
    content: r.content,
    source: r.source,
    score: Number(r.score),
  }));
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
      const vec = vectorSql(embeddings[i]);

      // Perform upsert with a single SQL statement and return the row id

      const rows = await tx.$queryRaw<{ id: string }[]>(
        Prisma.sql`
          with ins as (
            insert into document_chunks (
              "userId", "fileId", source, content, metadata, tokens, "contentHash", embedding
            ) values (
              ${userId}, ${fileId ?? null}, ${c.source ?? source ?? null}, ${
          c.content
        }, ${c.metadata ?? null}, ${c.tokens}, ${contentHash}, ${vec}
            )
            on conflict ("contentHash") do update set
              "userId" = excluded."userId",
              "fileId" = excluded."fileId",
              source = excluded.source,
              content = excluded.content,
              metadata = excluded.metadata,
              tokens = excluded.tokens,
              embedding = excluded.embedding
            returning id
          )
          select id from ins
          union all
          select id from document_chunks where "contentHash" = ${contentHash}
          limit 1;
        `
      );

      // rows[0]?.id is available if needed in the future
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

// Build a SQL fragment for a pgvector literal: ARRAY[...]::vector
function vectorSql(vec: number[]) {
  return Prisma.sql`ARRAY[${Prisma.join(vec)}]::vector`;
}

function hashContent(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}
