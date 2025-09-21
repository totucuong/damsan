import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isLikelyImagePath(path?: string): boolean {
  if (!path) return false;
  // Check common image extensions; tolerate query/hash suffixes
  return /\.(png|jpe?g|gif|webp|svg)(?:[?#].*)?$/i.test(path);
}

export function firstImgSrcFromHtml(html?: string): string | null {
  if (!html) return null;
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1] ?? null;
}
