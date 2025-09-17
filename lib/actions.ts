"use server";

import {
  loadMessages,
  saveMessages as dbSaveMessages,
  Message,
  loadProfile,
  addToWaitlist,
} from "./db";
import { uploadFile as dbUploadFile } from "./storage";
import { parseDocument as analyzeDocument } from "./document";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getMessages(userId: string) {
  return loadMessages(userId);
}

export async function getProfile(userId: string) {
  return loadProfile(userId);
}

export async function saveMessages(messages: Message[], userId: string) {
  return dbSaveMessages(messages, userId);
}

export async function uploadFile(file: File) {
  return dbUploadFile(file);
}

export async function analyzeDocuments(files: File[]) {
  return Promise.all(
    files.map(async (file) => {
      return analyzeDocument(file);
    })
  );
}

export async function processUserMessage(
  message: Message,
  userId: string,
  selectedFiles?: File[]
): Promise<Message[]> {
  let aiResponse: Message[] = [];
  try {
    if (selectedFiles && selectedFiles?.length > 0) {
      const documents = await analyzeDocuments(selectedFiles);
      aiResponse = [
        {
          isUser: false,
          message: `I have processed ${documents.length} document(s) you provided.`,
          isTyping: false,
          timestamp: new Date(),
          files: selectedFiles,
          documents: documents,
        },
      ];
    }
    await saveMessages([message, ...aiResponse], userId);
  } catch (error) {
    console.error("Failed to process user message:", error);
  }
  return aiResponse;
}

export async function joinWaitlist(formData: FormData) {
  const firstname = (formData.get("firstname") as string | null)?.trim() || undefined;
  const lastname = (formData.get("lastname") as string | null)?.trim() || undefined;
  const emailRaw = (formData.get("email") as string | null)?.trim();

  if (!emailRaw) {
    // No email provided; just bounce back to the form.
    redirect("/waitlist?error=missing_email");
  }

  const email = emailRaw.toLowerCase();
  await addToWaitlist({ firstname, lastname, email });

  // Optionally revalidate landing page if it reflects state
  revalidatePath("/");
  redirect("/waitlist/thanks");
}
