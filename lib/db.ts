import { PrismaClient } from "@prisma/client";
import { uploadFile } from "./storage";

export interface Message {
    id?: string; // Optional since new messages won't have an ID yet
    isUser: boolean;
    message: string;
    timestamp: Date;
    isTyping: boolean;
    files?: File[];
}



const prisma = new PrismaClient();

export async function loadMessages(userId: string): Promise<Message[]> {
    return prisma.message.findMany({
        where: {
            userId: userId
        },
        orderBy: { timestamp: 'asc' }
    }).then((messages) => {
        return messages.map((message) => ({
            isUser: message.type === "HUMAN",
            message: message.message,
            timestamp: message.timestamp,
            isTyping: false
        }));
    });
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
                    userId: userId
                }
            });

            // Save files if they exist (associate with the created message)
            if (message.files && message.files.length > 0) {
                await Promise.all(
                    message.files.map(async (file) => {
                        try {
                            const fileData = await uploadFile(file);
                            return await prisma.file.create({
                                data: {
                                    url: fileData.fullPath,
                                    owner_id: userId,
                                    message_id: createdMessage.id
                                }
                            });
                        } catch (error) {
                            console.error('Failed to upload file:', error)
                        }
                    })
                );
            }

            return createdMessage;
        })
    );
}
