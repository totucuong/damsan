import { PrismaClient } from "@prisma/client";

export interface Message {
    isUser: boolean;
    message: string;
    isTyping: boolean;
}



const prisma = new PrismaClient();


export async function saveMessage(message: Message, userId: string) {
    await prisma.message.create({
        data: {
            message: message.message,
            type: message.isUser ? "HUMAN" : "BOT",
            userId: userId
        }
    });
}

export async function saveAllMessages(messages: Message[], userId: string) {
    await prisma.message.createMany({
        data: messages.map((message) => ({
            message: message.message,
            type: message.isUser ? "HUMAN" : "BOT",
            userId: userId
        }))
    });
}


const memory: Record<string, Message[]> = {
    "user_1":
        [{ "isUser": true, "message": "Which medicines have I taken today?", isTyping: false },
        { "isUser": false, "message": "you have taken paracetamol", isTyping: false },]
};

export function loadMemory(userId: string) {
    return memory[userId];
}