"use server";

import { createClient } from "@/utils/supabase/server";
/**
 * Create a short-lived signed URL for a private file in Supabase Storage.
 * @param path Path within the configured bucket (i.e. "user-id/filename.png")
 * @param expiresIn Seconds until expiry (default 5 minutes)
 * @returns A signed URL string or null on failure
 */
export async function createSignedStorageUrl(
  path: string,
  expiresIn: number = 300
): Promise<string | null> {
  if (!path) return null;
  const bucket = process.env.SUPABASE_BUCKET;
  if (!bucket) return null;

  try {
    const supabase = await createClient();

    const userId = await supabase.auth.getUser().then(({ data }) => {
      return data.user?.id;
    });
    if (!userId) throw new Error("User must be authenticated");
    const filePath = [userId, path].join("/");

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);
    return data?.signedUrl ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
