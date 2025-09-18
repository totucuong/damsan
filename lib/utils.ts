import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ParsedDocument } from "./document";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function textFromParsedDocument(doc: ParsedDocument): string {
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
