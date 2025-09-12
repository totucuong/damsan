"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, X } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string, files?: File[]) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setSelectedFiles(prev => [...prev, ...files]);
    setShowFileUpload(true);
  };

  const handleFileRemove = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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
    setSelectedFiles(prev => [...prev, ...files]);
    setShowFileUpload(true);
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
        <div className="flex-1 relative">
          {selectedFiles.length > 0 && (
            <div className="mb-2 p-3 bg-muted rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
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
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="relative"
          >
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message or drag files here..."
              className="w-full min-h-[100px] max-h-32 resize-none bg-input border-chat-border focus:border-primary/50 rounded-2xl pl-7 pr-28"
            />
            <div className="absolute bottom-2 left-4 flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={handlePaperclipClick}
              >
                <Paperclip className="w-5 h-5" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.pptx"
              />
            </div>
            <div className="absolute bottom-2 right-2 flex items-center gap-2">

              <Button
                type="submit"
                size="icon"
                className="rounded-full bg-primary hover:bg-primary/90 shadow-md"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

          </div>
        </div>


      </form>
    </div >
  );
}


