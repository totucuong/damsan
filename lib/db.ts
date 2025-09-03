const memory = [{ "type": "user", "content": "Which medicines have I taken today?" },
{ "type": "bot", "content": "you have taken paracetamol" },];

export function loadMemory(userId: string) {
    return memory;
}