"use client";
import { ChatInput } from "./ChatInput";
import { Memory } from "./Memory";
import { useState } from "react";
import { loadMemory, Message } from "../lib/db";
import Image from "next/image";
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
        <div className="max-w-dvw mx-auto h-screen flex flex-col overflow-y-auto">
            <div className="flex items-center gap-3 p-4 border-b sticky top-0 bg-white z-10">
                <Image
                    src="/daki_logo.png"
                    alt="Daki Life Logo"
                    width={120}
                    height={120}
                    className="rounded"
                />
                <h1 className="text-2xl font-bold">Daki Life</h1>
            </div>
            <div className="flex-1 flex flex-col ">
                <div className="flex-1 p-4">
                    <Memory memory={memory} />
                </div>
                <div className=" bg-white">
                    <ChatInput onSendMessage={handleSendMessage} />
                </div>
            </div>
        </div>
    );
}