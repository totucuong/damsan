interface Message {
    isUser: boolean;
    message: string;
    isTyping: boolean;
}
// const memory: { [userId: string]: Message[] } = {
//     "user_1":
//         [{ "isUser": true, "message": "Which medicines have I taken today?", isTyping: false },
//         { "isUser": false, "message": "you have taken paracetamol", isTyping: false },]
// };

const memory: Record<string, Message[]> = {
    "user_1":
        [{ "isUser": true, "message": "Which medicines have I taken today?", isTyping: false },
        { "isUser": false, "message": "you have taken paracetamol", isTyping: false },]
};

export function loadMemory(userId: string) {
    return memory[userId];
}