"use server";

import {
  loadMessages,
  saveMessages as dbSaveMessages,
  Message,
  loadProfile,
  addToWaitlist,
} from "./db";
import { uploadFile as dbUploadFile } from "./storage";
import { parseDocument as analyzeDocument, textFromParsedDocument } from "./document";
import { indexParsedDocumentPg, answerWithRagPg } from "./rag";
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
      // Index parsed documents into pgvector for RAG
      try {
        await Promise.all(
          documents.map(async (doc, idx) => {
            const text = textFromParsedDocument(doc);
            const file = selectedFiles?.[idx];
            await indexParsedDocumentPg({
              userId,
              fileId: undefined,
              source: file?.name ?? "upload",
              text,
            });
          })
        );
      } catch (e) {
        console.error("Indexing failed:", e);
      }

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
      await saveMessages([message, ...aiResponse], userId);
    } else {
      // No files: answer via RAG
      const { answer, citations } = await answerWithRagPg({ userId, question: message.message });
      const aiMessage: Message = {
        isUser: false,
        message:
          citations && citations.length > 0
            ? `${answer}\n\nSources:\n${citations.map((c, i) => `[${i + 1}] ${c.source || c.id}`).join("\n")}`
            : answer,
        isTyping: false,
        timestamp: new Date(),
      };
      aiResponse = [aiMessage];
      await saveMessages([message, aiMessage], userId);
    }
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
