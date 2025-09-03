"use client";
import { ChatInput } from "./ChatInput";
import { Memory } from "./Memory";
import { useState } from "react";
import { loadMemory, Message } from "../lib/db";
export function App({ userId }: { userId: string }) {
    const [memory, setMemory] = useState<Message[]>(loadMemory(userId));

    const handleSendMessage = (message: string) => {
        const newMessage: Message = {
            isUser: true,
            message: message,
            isTyping: false
        };
        setMemory(prev => [...prev, newMessage]);

        // TODO: Add AI response logic here
        // For now, just add a simple response
        setTimeout(() => {
            const aiResponse: Message = {
                isUser: false,
                message: "I received your message: " + message,
                isTyping: false
            };
            setMemory(prev => [...prev, aiResponse]);
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold">Daki Life</h1>
            <div>
                <Memory memory={memory} />
                <ChatInput onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
}