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
        }
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
                        // For now, we'll store a placeholder URL - in production you'd upload to cloud storage
                        const fileUrl = `uploads/${Date.now()}_${file.name}`;
                        await uploadFile(file);

                        return await prisma.file.create({
                            data: {
                                url: fileUrl,
                                owner_id: userId,
                                message_id: createdMessage.id
                            }
                        });
                    })
                );
            }

            return createdMessage;
        })
    );
}
