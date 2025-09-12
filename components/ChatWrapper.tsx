"use client";
import { ChatInput } from "./ChatInput";
import { Memory } from "./Memory";
import { useState } from "react";
import { Message } from "../lib/db";
import { processUserMessage } from "../lib/actions";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function ChatWrapper({ userId, messages }: { userId: string; messages: Message[] }) {
    const [memory, setMemory] = useState<Message[]>(messages);
    const router = useRouter();

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/auth/login');
    };

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
            <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-3">
                    <Image
                        src="/logo.png"
                        alt="Damsan.Life Logo"
                        width={40}
                        height={40}
                        className="rounded"
                    />
                    <h1 className="font-mono text-xl">Welcome back!</h1>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    Sign out
                </Button>
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