import { loadMemory } from "../lib/db";

// a memory is a list of messages
export function Memory({ userId }: { userId: string }) {
    const memory = loadMemory(userId);
    return (
        <div>
            <h1>Memory</h1>
            {memory.map((message, index) => (
                <div key={index}>
                    <p>{message.content}</p>
                </div>
            ))}
        </div>
    );
}