import { Message as AiMessage, MessageAvatar, MessageContent } from "@/components/ui/shadcn-io/ai/message";
import { Sources, SourcesContent, SourcesTrigger, Source } from "@/components/ui/shadcn-io/ai/source";
import type { Citation } from "@/lib/rag";

export interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
  citations?: Citation[];
}

export function ChatMessage({
  message,
  isUser,
  // keeping timestamp for future use, not rendered for now
  timestamp,
  isTyping = false,
  citations,
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

        {!isUser && citations && citations.length > 0 ? (
          <Sources>
            <SourcesTrigger count={citations.length} />
            <SourcesContent>
              {citations.map((c, i) => {
                const rawTitle = c.source || c.id;
                const title = `[${i + 1}] ${rawTitle}`;
                const href = /^https?:\/\//i.test(rawTitle) ? rawTitle : undefined;
                return (
                  <Source
                    key={c.id || i}
                    href={href || "#"}
                    title={title}
                    sourceType={c.sourceType}
                    aria-label={c.preview ? `${title}: ${c.preview}` : title}
                  />
                );
              })}
            </SourcesContent>
          </Sources>
        ) : null}
      </MessageContent>
      <MessageAvatar
        src={isUser ? undefined : "/logo.png"}
        name={isUser ? "You" : "AI"}
      />
    </AiMessage>
  );
}
