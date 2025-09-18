"use client";
import { Message } from "../lib/db";
import { ChatMessage } from "./ChatMessage";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ui/shadcn-io/ai/conversation";

// a memory is a list of messages
export function Memory({ memory }: { memory: Message[] }) {
  return (
    <Conversation className="max-w-4xl mx-auto w-full">
      <ConversationContent>
        {memory.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.message}
            isUser={message.isUser}
            timestamp={message.timestamp}
            isTyping={message.isTyping}
          />
        ))}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
