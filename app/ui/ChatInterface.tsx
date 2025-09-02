"use client";
import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const EXAMPLE_PROMPTS = [
  "Help me write a professional email",
  "Explain quantum computing in simple terms",
  "Create a workout plan for beginners",
  "Write a short story about a robot",
];

const BOT_RESPONSES = [
  "I'd be happy to help you with that! Let me break it down for you step by step.",
  "That's a great question! Here's what I think about that topic.",
  "Absolutely! I can definitely assist you with this. Let me provide some detailed guidance.",
  "Interesting request! I'll do my best to give you a comprehensive and helpful response.",
  "Perfect! I love helping with creative and practical tasks like this one.",
];

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateBotResponse = (userMessage: string) => {
    setIsTyping(true);

    setTimeout(() => {
      const randomResponse =
        BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
      const botMessage: Message = {
        id: Date.now().toString() + "_bot",
        content: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };
// here should be were we send message to the serve
// the easy way is to use Rest API
    setMessages((prev) => [...prev, userMessage]);
    simulateBotResponse(content);
  };

  const handleExamplePrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-chat-background to-background">
      {/* Header */}
      <div className="border-b border-border bg-background/50 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center"></div>
          <div>
            <h1 className="font-semibold text-foreground">DakiLife</h1>
            <p className="text-sm text-muted-foreground">
              {isTyping
                ? "Typing..."
                : "Ready to answer everything about your health history"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-sky-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-3 text-foreground">
                Welcome to Daki Life
              </h2>
              <p className="text-muted-foreground mb-8">
                Start a conversation by typing a message or try one of these
                examples:
              </p>

              <div className="grid gap-3">
                {EXAMPLE_PROMPTS.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleExamplePrompt(prompt)}
                    className="text-left justify-start h-auto p-4 border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {isTyping && (
              <ChatMessage
                message=""
                isUser={false}
                timestamp={new Date()}
                isTyping={true}
              />
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
};
