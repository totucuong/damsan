"use client";
import { Message } from "../lib/db";
import { ChatMessage } from "./ChatMessage";
import { useRef, useEffect } from "react";

// a memory is a list of messages
export function Memory({ memory }: { memory: Message[] }) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom();
    }, [memory]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    return (
        <div className="max-w-4xl mx-auto">
            {memory.map((message, index) => (
                <div key={index}>
                    <ChatMessage message={message.message} isUser={message.isUser} timestamp={new Date()} />
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}