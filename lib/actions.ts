"use server";

import {
  loadMessages,
  saveMessages as dbSaveMessages,
  Message,
  loadProfile,
} from "./db";
import { uploadFile as dbUploadFile } from "./storage";
import { parseDocument as analyzeDocument } from "./document";

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
