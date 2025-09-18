"use client";
import { ChatInput } from "./ChatInput";
import { Memory } from "./Memory";
import { useState, useEffect, useRef } from "react";
import { Message } from "../lib/db";
import { processUserMessage } from "../lib/actions";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { getProfile } from "../lib/actions";

export function ChatWrapper({
  user,
  messages,
}: {
  user: User;
  messages: Message[];
}) {
  const [memory, setMemory] = useState<Message[]>(messages);
  const [welcome, setWelcome] = useState<string>("");
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  useEffect(() => {
    const compute_welcome_message = async () => {
      const profile = await getProfile(user.id);
      setWelcome(`Welcome back ${profile.firstname}!`);
    };
    compute_welcome_message();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [memory]);

  const handleSendMessage = async (message: string, selectedFiles?: File[]) => {
    const newMessage: Message = {
      isUser: true,
      message: message,
      timestamp: new Date(),
      isTyping: false,
      ...(selectedFiles?.length && { files: selectedFiles }),
    };
    setMemory((prev) => [...prev, newMessage]);
    const reponse_messages = await processUserMessage(
      newMessage,
      user.id,
      selectedFiles
    );
    setMemory((prev) => [...prev, ...reponse_messages]);
  };

  return (
    <div className="max-w-dvw mx-auto h-screen flex flex-col overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Damsan.Life Logo"
            width={32}
            height={32}
            className="rounded"
          />
          <h1 className="font-mono text-xl">
            {welcome || `Welcome back ${user.email}!`}
          </h1>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto pt-14">
        <div className="flex-1 p-4">
          <Memory memory={memory} />
        </div>
        <div>
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
        <div ref={bottomRef}> </div>
      </div>
    </div>
  );
}
