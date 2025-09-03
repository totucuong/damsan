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
        <div className="max-w-4xl mx-auto h-screen flex flex-col">
            <h1 className="text-2xl font-bold p-4 border-b sticky top-0 bg-white z-10">Daki Life</h1>
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4">
                    <Memory memory={memory} />
                </div>
                <div className="border-t bg-white">
                    <ChatInput onSendMessage={handleSendMessage} />
                </div>
            </div>
        </div>
    );
}