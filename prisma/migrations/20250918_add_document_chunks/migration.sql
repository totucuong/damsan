-- Enable required extensions
create extension if not exists vector;
create extension if not exists pgcrypto;

-- Create table for chunk-level retrieval
create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  "userId" text not null,
  "fileId" text,
  source text,
  content text not null,
  metadata jsonb,
  tokens integer not null,
  "contentHash" text not null unique,
  embedding vector(1536),
  "createdAt" timestamptz not null default now()
);

-- Helpful indexes
create index if not exists document_chunks_user_created_idx
  on document_chunks("userId", "createdAt" desc);

-- IVFFLAT index for vector search (cosine)
create index if not exists document_chunks_embedding_ivfflat
  on document_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

analyze document_chunks;

