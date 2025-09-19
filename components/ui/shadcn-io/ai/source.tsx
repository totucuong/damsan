"use client";

import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  BookIcon,
  ChevronDownIcon,
  StickyNote as StickyNoteIcon,
  TestTube as TestTubeIcon,
  Stethoscope as StethoscopeIcon,
  Pill as PillIcon,
  FileQuestionMark as FileQuestionMarkIcon,
} from "lucide-react";
import type { ComponentProps } from "react";
import type { DocumentType } from "@/lib/document_types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export type SourcesProps = ComponentProps<"div">;

export const Sources = ({ className, ...props }: SourcesProps) => (
  <Collapsible
    className={cn("not-prose mb-4 text-primary text-xs", className)}
    {...props}
  />
);

export type SourcesTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  count: number;
};

export const SourcesTrigger = ({
  className,
  count,
  children,
  ...props
}: SourcesTriggerProps) => (
  <CollapsibleTrigger className="flex items-center gap-2" {...props}>
    {children ?? (
      <>
        <p className="font-medium">Used {count} sources</p>
        <ChevronDownIcon className="h-4 w-4" />
      </>
    )}
  </CollapsibleTrigger>
);

export type SourcesContentProps = ComponentProps<typeof CollapsibleContent>;

export const SourcesContent = ({
  className,
  ...props
}: SourcesContentProps) => (
  <CollapsibleContent
    className={cn(
      "mt-3 flex w-fit flex-col gap-2",
      "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
      className
    )}
    {...props}
  />
);

export type SourceProps = ComponentProps<"a"> & {
  sourceType?: DocumentType;
  previewText?: string;
  fileUrl?: string;
};

function SourceIcon({ type }: { type?: DocumentType }) {
  switch (type) {
    case "handwritten_note":
      return <StickyNoteIcon className="h-4 w-4" />;
    case "lab_test":
      return <TestTubeIcon className="h-4 w-4" />;
    case "medical_prescription":
      return <StethoscopeIcon className="h-4 w-4" />;
    case "drug_package":
      return <PillIcon className="h-4 w-4" />;
    case "unknown":
      return <FileQuestionMarkIcon className="h-4 w-4" />;
    default:
      return <BookIcon className="h-4 w-4" />;
  }
}

export const Source = ({
  href,
  title,
  children,
  sourceType,
  previewText,
  fileUrl,
  onClick,
  ...props
}: SourceProps) => {
  const [open, setOpen] = React.useState(false);

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (e.metaKey || e.ctrlKey || e.button === 1) return; // allow new-tab gestures
    e.preventDefault();
    setOpen((o) => !o);
    onClick?.(e);
  };

  const contentHref = href;

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>
        <a
          className="flex items-center gap-2"
          href={href}
          rel="noreferrer"
          target="_blank"
          onClick={handleClick}
          {...props}
        >
          {children ?? (
            <>
              <SourceIcon type={sourceType} />
              <span className="block font-medium">{title}</span>
            </>
          )}
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex items-start gap-2">
          <SourceIcon type={sourceType} />
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium" title={title}>
              {title}
            </div>
            {previewText ? (
              <p className="mt-1 line-clamp-6 whitespace-pre-wrap text-xs text-muted-foreground">
                {previewText}
              </p>
            ) : null}
            {contentHref ? (
              <div className="mt-2">
                <a
                  className="text-xs font-medium text-primary underline underline-offset-2 hover:opacity-80"
                  href={contentHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open source
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
