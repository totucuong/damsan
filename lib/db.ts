import { Prisma, PrismaClient, User } from "@prisma/client";
import type { Citation } from "./rag";
import { uploadFile } from "./storage";
import { ParsedDocument } from "./document";
import { textFromParsedDocument } from "./rag";
import { indexParsedDocumentPg } from "./rag_actions";

export interface Message {
  id?: string; // Optional since new messages won't have an ID yet
  isUser: boolean;
  message: string;
  timestamp: Date;
  isTyping: boolean;
  files?: File[]; // an user message can have multiple files
  documents?: ParsedDocument[]; // an AI message can have multiple parsed documents & files
  citations?: Citation[]; // optional citations for AI messages
}

const prisma = new PrismaClient();

export async function loadProfile(userId: string): Promise<User> {
  return prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });
}

export async function loadMessages(userId: string): Promise<Message[]> {
  return prisma.message
    .findMany({
      where: {
        userId: userId,
      },
      orderBy: { timestamp: "asc" },
    })
    .then((rows) =>
      rows.map((row) => ({
        isUser: row.type === "HUMAN",
        message: row.message,
        timestamp: row.timestamp,
        isTyping: false,
        citations: (row.citations as unknown as Citation[] | undefined) || undefined,
      }))
    );
}

// try {
//   const text = textFromParsedDocument(doc);
//   await indexParsedDocumentPg({
//     userId,
//     fileId: fileIds?.[idx],
//     source: file?.name ?? "upload",
//     text,
//   });
// } catch (e) {
//   console.error("Indexing failed:", e);
// }

export async function indexParsedDocument(
  doc: ParsedDocument,
  userId: string,
  fileId: string,
  source: string
) {
  try {
    const text = textFromParsedDocument(doc);
    await indexParsedDocumentPg({
      userId,
      fileId,
      source,
      text,
    });
  } catch (e) {
    console.error("Indexing failed:", e);
  }
}

export async function saveMessages(messages: Message[], userId: string) {
  // Save messages and their associated files
  await Promise.all(
    messages.map(async (message, index) => {
      // Create the message first
      const createdMessage = await prisma.message.create({
        data: {
          message: message.message,
          type: message.isUser ? "HUMAN" : "BOT",
          timestamp: message.timestamp,
          userId: userId,
          ...(message.citations
            ? { citations: message.citations as unknown as Prisma.InputJsonValue }
            : {}),
        },
      });

      // Save files if they exist (associate with the created message)
      if (!message.isUser && message.files && message.files.length > 0) {
        const results = await Promise.all(
          message.files.map(async (file, idx) => {
            try {
              const fileData = await uploadFile(file);
              return await prisma.file.create({
                data: {
                  url: fileData.fullPath,
                  owner_id: userId,
                  message_id: createdMessage.id,
                },
              });
            } catch (error) {
              console.error("Failed to upload file:", error);
              return null; // Return null for failed uploads
            }
          })
        );

        // Filter out null results from failed uploads
        const successfulResults = results.filter(
          (result): result is NonNullable<typeof result> => result !== null
        );
        console.log("Uploaded files:", successfulResults);

        // Check if documents exist and match the successful uploads
        if (
          message.documents &&
          successfulResults.length > 0 &&
          message.documents.length === successfulResults.length
        ) {
          // Update files with document metadata if available
          await Promise.all(
            successfulResults.map((fileRecord, idx) => {
              const doc = message.documents![idx]; // We can use ! here as we've checked above
              try {
                const text = textFromParsedDocument(doc);
                console.log("Indexing document for file:", fileRecord.id);
                console.log("userid is:", userId);
                indexParsedDocumentPg({
                  userId,
                  fileId: fileRecord.id,
                  source: fileRecord.id,
                  text,
                });
              } catch (e) {
                console.error("Indexing failed:", e);
              }

              return prisma.file.update({
                where: { id: fileRecord.id },
                data: {
                  metadata: doc.metadata,
                  content: doc.content as Prisma.InputJsonValue,
                  type: doc.type,
                },
              });
            })
          );
        }
      }

      return createdMessage;
    })
  );
}

export async function addToWaitlist(params: {
  firstname?: string;
  lastname?: string;
  email: string;
}) {
  const email = params.email.trim().toLowerCase();
  return prisma.waitlist.upsert({
    where: { email },
    update: {
      firstname: params.firstname ?? undefined,
      lastname: params.lastname ?? undefined,
    },
    create: {
      email,
      firstname: params.firstname ?? undefined,
      lastname: params.lastname ?? undefined,
    },
  });
}
