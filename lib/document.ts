"use server";

import OpenAI from "openai";
import { z } from "zod";
import { prompt } from "./prompt";
// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Define schema for validating the output of parsing user documents
const ParsedDocumentSchema = z.object({
  metadata: z.string().describe("A detailed description of the document"),
  type: z
    .enum([
      "handwritten_note",
      "lab_test",
      "medical_prescription",
      "drug_package",
      "unknown",
    ])
    .describe("The type of document parsed"),
  content: z
    .any()
    .describe("The structured content extracted from the document"),
});
export type ParsedDocument = z.infer<typeof ParsedDocumentSchema>;

export async function parseDocument(document: File): Promise<ParsedDocument> {
  try {
    // Convert file to base64
    const arrayBuffer = await document.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mime = document.type || "application/octet-stream";

    if (
      !/^image\//.test(mime) &&
      mime !== "application/pdf" &&
      mime !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && // .docx
      mime !== "application/msword" // .doc
    ) {
      throw new Error(`Unsupported file type: ${mime}`);
    }

    const dataUrl = `data:${mime};base64,${base64}`;

    // Call OpenAI Vision API with JSON response format
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt.system_prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: dataUrl,
                detail: "high",
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response content from OpenAI");
    }

    const parsedResult = JSON.parse(content);
    console.log("parsedResult: ", parsedResult);

    // Validate the response using Zod schema
    return ParsedDocumentSchema.parse(parsedResult);
  } catch (error) {
    console.error("Error parsing document:", error);
    throw new Error(
      `Document parsing failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export function textFromParsedDocument(doc: ParsedDocument): string {
  try {
    const header = `${doc.type?.toString?.() || "unknown"}\n${doc.metadata || ""}`.trim();
    const body = typeof doc.content === "string"
      ? doc.content
      : JSON.stringify(doc.content, null, 2);
    return [header, body].filter(Boolean).join("\n\n");
  } catch {
    return "";
  }
}
