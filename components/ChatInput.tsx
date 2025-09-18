"use client";
import { useState, useRef, useEffect } from "react";
import { Paperclip, X } from "lucide-react";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
} from "@/components/ui/shadcn-io/ai/prompt-input";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSendMessage: (message: string, files?: File[]) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomInputRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedFiles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedFiles.length > 0) {
      onSendMessage(message.trim(), selectedFiles);
      setMessage("");
      setSelectedFiles([]);
      setShowFileUpload(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
    setShowFileUpload(true);
  };

  const handleFileRemove = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    setShowFileUpload(true);
  };

  // Enter handling is managed by PromptInputTextarea

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {selectedFiles.length > 0 && (
          <div className="mb-2 p-3 bg-muted rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFiles([]);
                  setShowFileUpload(false);
                }}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="truncate flex-1 mr-2">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFileRemove(index)}
                    className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <PromptInput
          onSubmit={handleSubmit}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="max-w-4xl mx-auto"
        >
          <PromptInputTextarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message or drag files here..."
          />
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputButton
                aria-label="Attach files"
                onClick={handlePaperclipClick}
              >
                <Paperclip className="w-4 h-4" />
              </PromptInputButton>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.pptx"
              />
            </PromptInputTools>
            <PromptInputSubmit />
          </PromptInputToolbar>
        </PromptInput>
        <div ref={bottomInputRef}></div>
      </div>
    </div>
  );
}
