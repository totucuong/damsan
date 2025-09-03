"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export function ChatInput() {
  const [message, setMessage] = useState("");

  function onSendMessage(message: string) {
    console.log(message);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-background/80 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 items-end max-w-4xl mx-auto"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[44px] max-h-32 resize-none bg-input border-chat-border focus:border-primary/50 rounded-2xl pr-12"
          />
        </div>

        <Button
          type="submit"
          size="icon"
          className="rounded-full bg-primary hover:bg-primary/90 shadow-md"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}


