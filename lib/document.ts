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
    .json()
    .describe("The structured content extracted from the document"),
});
type ParsedDocument = z.infer<typeof ParsedDocumentSchema>;

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

// Define the structure for the extracted data
const ImageAnalysisSchema = z.object({
  description: z
    .string()
    .describe("A detailed description of what is shown in the image"),
  objects: z
    .array(z.string())
    .describe("List of objects or items visible in the image"),
  text: z
    .string()
    .nullable()
    .optional()
    .describe("Any text content found in the image"),
  colors: z.array(z.string()).describe("Dominant colors in the image"),
  mood: z.string().describe("The overall mood or atmosphere of the image"),
  tags: z.array(z.string()).describe("Relevant tags or keywords for the image"),
  people_count: z.number().describe("Number of people visible in the image"),
  location_type: z
    .string()
    .nullable()
    .optional()
    .describe("Type of location if identifiable (indoor, outdoor, etc.)"),
});

type ImageAnalysis = z.infer<typeof ImageAnalysisSchema>;

/**
 * Analyzes an image file directly (before uploading to storage)
 * @param file - The image file to analyze
 * @returns Structured data extracted from the image
 */
export async function analyzeDocument(file: File): Promise<ImageAnalysis> {
  try {
    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // Determine the image format
    const imageFormat = file.type.includes("png") ? "png" : "jpeg";
    const dataUrl = `data:image/${imageFormat};base64,${base64Image}`;

    // Call OpenAI Vision API with JSON response format
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: 'Analyze this image and extract structured information about it. Provide a detailed description, identify objects, extract any text, note dominant colors, assess the mood, generate relevant tags, count people, and identify the location type if possible. Return the response as a valid JSON object with the following structure: {"description": string, "objects": string[], "text": string (optional), "colors": string[], "mood": string, "tags": string[], "people_count": number, "location_type": string (optional)}',
            },
            {
              type: "image_url",
              image_url: {
                url: dataUrl,
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

    const analysisResult = JSON.parse(content);
    console.log("analysisResult: ", analysisResult); // works up to here

    // Validate the response using Zod schema
    return ImageAnalysisSchema.parse(analysisResult);
  } catch (error) {
    console.error("Error analyzing image file:", error);
    throw new Error(
      `Image analysis failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
