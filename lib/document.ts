"use server";

import OpenAI from "openai";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { prompt } from "./prompt";
// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

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
 * Retrieves an image from Supabase storage and generates structured data using OpenAI Vision API
 * @param imagePath - The path to the image in Supabase storage
 * @param userId - The user ID for authentication
 * @returns Structured data extracted from the image
 */
export async function analyzeImageFromStorage(
  imagePath: string,
  userId: string
): Promise<ImageAnalysis> {
  try {
    // Create Supabase client
    const supabase = await createClient();

    // Verify user authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || user.id !== userId) {
      throw new Error(
        "User must be authenticated and match the provided userId"
      );
    }

    // Get the image from Supabase storage
    const { data: imageData, error: downloadError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .download(imagePath);

    if (downloadError) {
      throw new Error(`Failed to download image: ${downloadError.message}`);
    }

    // Convert blob to base64
    const arrayBuffer = await imageData.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // Determine the image format from the file extension or content type
    const imageFormat = imagePath.toLowerCase().includes(".png")
      ? "png"
      : "jpeg";
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
              text: prompt.gpt4oMini,
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

    // Validate the response using Zod schema
    return ImageAnalysisSchema.parse(analysisResult);
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error(
      `Image analysis failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

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
