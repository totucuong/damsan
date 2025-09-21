"use client";

import * as React from "react";
import Image from "next/image";
import { createSignedStorageUrl } from "@/lib/storage_actions";
import { cn, firstImgSrcFromHtml, isLikelyImagePath } from "@/lib/utils";

export type ImagePreviewProps = {
  /** Storage path within the bucket (e.g., "user-id/filename.png"). */
  filePath?: string;
  /** Optional HTML string to scan for the first <img src>. */
  htmlHint?: string;
  /** Accessible alt text; falls back to a filename-based label. */
  alt?: string;
  /** Optional caption shown below the thumbnail. */
  caption?: string;
  /** Optional className for the wrapper. */
  className?: string;
};

export function ImagePreview({
  filePath,
  htmlHint,
  alt,
  caption,
  className,
}: ImagePreviewProps) {
  const [src, setSrc] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");

  React.useEffect(() => {
    let cancelled = false;
    async function resolveSrc() {
      setStatus("loading");
      console.log(
        "file path and htmlHint in ImagePreview:",
        filePath,
        htmlHint
      );

      // Prefer Supabase file path if it looks like an image
      if (filePath && isLikelyImagePath(filePath)) {
        const signed = await createSignedStorageUrl(filePath).catch(() => null);
        console.log("Signed URL for image preview:", signed);
        if (!cancelled) {
          if (signed) {
            setSrc(signed);
            setStatus("ready");
            return;
          }
        }
      }

      // Otherwise try first <img> in provided HTML
      const fromHtml = firstImgSrcFromHtml(htmlHint || "");
      if (!cancelled) {
        if (fromHtml) {
          setSrc(fromHtml);
          setStatus("ready");
        } else {
          setStatus("error");
        }
      }
    }

    resolveSrc();
    return () => {
      cancelled = true;
    };
  }, [filePath, htmlHint]);

  const fallbackAlt = React.useMemo(() => {
    if (alt && alt.trim()) return alt.trim();
    const name = (filePath || src || "image").split("/").pop() || "image";
    return `Preview of ${decodeURIComponent(name)}`;
  }, [alt, filePath, src]);

  if (status === "loading") {
    return (
      <div
        className={cn(
          "mt-2 h-20 w-20 animate-pulse rounded-md bg-muted",
          className
        )}
        aria-label="Loading image preview"
      />
    );
  }

  if (status === "error" || !src) {
    console.log("No valid image preview available");
    return null;
  }

  return (
    <div className={cn("mt-2 max-w-full", className)}>
      {/* Use unoptimized to avoid remote domain config requirements */}
      <Image
        src={src}
        alt={fallbackAlt}
        width={160}
        height={160}
        className="h-20 w-20 rounded-md object-cover"
        unoptimized
        onError={() => setStatus("error")}
      />
      {caption ? (
        <div
          className="mt-1 truncate text-[10px] text-muted-foreground"
          title={caption}
        >
          {/* {caption} */}
        </div>
      ) : null}
    </div>
  );
}

export default ImagePreview;
