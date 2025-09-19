// Shared document type definitions for client and server
// Keep in sync with the parsing logic

export const DOCUMENT_TYPES = [
  "handwritten_note",
  "lab_test",
  "medical_prescription",
  "drug_package",
  "unknown",
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

