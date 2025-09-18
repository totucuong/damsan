import { Message as AiMessage, MessageAvatar, MessageContent } from "@/components/ui/shadcn-io/ai/message";

export interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export function ChatMessage({
  message,
  isUser,
  // keeping timestamp for future use, not rendered for now
  timestamp,
  isTyping = false,
}: ChatMessageProps) {
  const role = isUser ? "user" : "assistant";
  return (
    <AiMessage from={role}>
      <MessageContent>
        {isTyping ? (
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed">{message}</p>
        )}
      </MessageContent>
      <MessageAvatar
        src={isUser ? undefined : "/logo.png"}
        name={isUser ? "You" : "AI"}
      />
    </AiMessage>
  );
}
