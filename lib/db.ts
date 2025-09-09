import { PrismaClient } from "@prisma/client";

export interface Message {
    isUser: boolean;
    message: string;
    timestamp: Date;
    isTyping: boolean;
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
// export async function saveMessage(message: Message, userId: string) {
//     await prisma.message.create({
//         data: {
//             message: message.message,
//             type: message.isUser ? "HUMAN" : "BOT",
//             timestamp: message.timestamp,
//             userId: userId
//         }
//     });
// }

export async function saveMessages(messages: Message[], userId: string) {
    await prisma.message.createMany({
        data: messages.map((message) => ({
            message: message.message,
            type: message.isUser ? "HUMAN" : "BOT",
            timestamp: message.timestamp,
            userId: userId
        }))
    });
}

// export async function createUser(email: string, firstname: string, lastname: string) {
//     return prisma.user.create({
//         data: {
//             email,
//             firstname,
//             lastname
//         }
//     });
// }
// uncomment and exexcute with "npx tsx lib/db.ts"
// async function main() {
//     // const user = await createUser("totucuong@gmail.com", "Cuong", "To");
//     await saveMessage({
//         message: "Who am I ?",
//         isUser true,
//         isTyping: false
//     } satisfies Message, "8d3e9345-e1e9-459c-b453-9fc229a9511f");
// }


// const memory: Record<string, Message[]> = {
//     "user_1":
//         [{ "isUser": true, "message": "Which medicines have I taken today?", isTyping: false },
//         { "isUser": false, "message": "you have taken paracetamol", isTyping: false },]
// };

// export function loadMemory(userId: string) {
//     return memory[userId];
// }
