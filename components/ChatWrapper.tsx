"use client";
import { ChatInput } from "./ChatInput";
import { Memory } from "./Memory";
import { useState } from "react";
import { Message } from "../lib/db";
import Image from "next/image";
export function ChatWrapper({ userId, messages }: { userId: string; messages: Message[] }) {
    const [memory, setMemory] = useState<Message[]>(messages);

    const handleSendMessage = (message: string, selectedFiles?: File[]) => {
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
                message: "I have read your messages and files: " + message + "\n" + selectedFiles?.map(file => file.name).join(", "),
                isTyping: false
            };
            setMemory(prev => [...prev, aiResponse]);
            console.log('processing files: ', selectedFiles)
        }, 1000);
    };

    return (
        <div className="max-w-dvw mx-auto h-screen flex flex-col overflow-y-auto">
            <div className="flex items-center gap-1 p-4 sticky top-0 bg-white z-10">
                <Image
                    src="/damsan_01.png"
                    alt="Damsan.Life Logo"
                    width={120}
                    height={120}
                    className="rounded"
                />
                {/* <h1 className="font-mono font-bold text-2xl">Damsan.Life</h1> */}
                <h1 className="font-mono text-3xl">Welcome back {userId}!</h1>
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