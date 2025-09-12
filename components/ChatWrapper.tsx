"use client";
import { ChatInput } from "./ChatInput";
import { Memory } from "./Memory";
import { useState } from "react";
import { Message } from "../lib/db";
import { processUserMessage, saveMessages } from "../lib/actions";
import { analyzeFiles } from "../lib/actions";
import Image from "next/image";

export function ChatWrapper({ userId, messages }: { userId: string; messages: Message[] }) {
    const [memory, setMemory] = useState<Message[]>(messages);

    const handleSendMessage = async (message: string, selectedFiles?: File[]) => {

        const newMessage: Message = {
            isUser: true,
            message: message,
            timestamp: (new Date()),
            isTyping: false,
            ...(selectedFiles?.length && { files: selectedFiles })
        };
        setMemory(prev => [...prev, newMessage]);
        const reponse_messages = await processUserMessage(newMessage, userId, selectedFiles);
        setMemory(prev => [...prev, ...reponse_messages]);

    };

    return (
        <div className="max-w-dvw mx-auto h-screen flex flex-col overflow-y-auto">
            <div className="flex items-center gap-1 p-4 sticky top-0 z-10">
                <Image
                    src="/logo.png"
                    alt="Damsan.Life Logo"
                    width={120}
                    height={120}
                    className="rounded"
                />
                {/* <h1 className="font-mono font-bold text-2xl">Damsan.Life</h1> */}
                <h1 className="font-mono text-3xl">Welcome back!</h1>
            </div>
            <div className="flex-1 flex flex-col ">
                <div className="flex-1 p-4">
                    <Memory memory={memory} />
                </div>
                <div>
                    <ChatInput onSendMessage={handleSendMessage} />
                </div>
            </div>
        </div>
    );
}