"use client";
import { loadMemory } from "../lib/db";
import { ChatMessage } from "./ChatMessage";

// a memory is a list of messages
export function Memory({ userId }: { userId: string }) {
    // @TODO: load memory from the database and using
    // streaming: https://nextjs.org/docs/app/getting-started/fetching-data#streaming
    const memory = loadMemory(userId);
    return (
        <div className="max-w-4xl mx-auto">
            {memory.map((message, index) => (
                <div key={index}>
                    <ChatMessage message={message.message} isUser={message.isUser} timestamp={new Date()} />
                </div>
            ))}
        </div>
    );
}