"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";
/**
 * Create a short-lived signed URL for a private file in Supabase Storage.
 * @param path Path within the configured bucket (e.g. "user-id/filename.png")
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

    // Verify user is authenticated
    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();
    // console.log("user id", user?.id);
    // console.log("bucket from env:", bucket);

    // // Temporary: list files in the user's bucket to verify access
    // // const userId = user?.id; // assuming path starts with user ID
    // const userId = "63561f1f-b61d-48aa-bf97-017b6f5221a8 ";
    // const { data, error } = await supabase.storage.from(bucket).list(userId);
    // console.log("Files in bucket for user:", data, error);
    // console.log("getting files from bucket:", bucket, "with path:", path);

    // const admin = createAdmin(
    //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //   process.env.SUPABASE_SERVICE_ROLE_KEY!
    // );
    // const { data: adminData, error: adminError } = await admin.storage
    //   .from(bucket)
    //   .list();
    // console.log("Admin - Files in bucket for user:", adminData, adminError);
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(
        "63561f1f-b61d-48aa-bf97-017b6f5221a8/drug_05.jpg",
        expiresIn
      );
    // console.log("createSignedStorageUrl data and error:", data, error);
    // console.log("path and bucket:", path.replace(" ", ""), bucket);
    return data?.signedUrl ?? null;
  } catch (error) {
    console.error("Error creating signed URL:", error);
    return null;
  }
}

// moved: isLikelyImagePath and firstImgSrcFromHtml -> lib/utils.ts
