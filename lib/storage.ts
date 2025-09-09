// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!);
'use server'
import { createClient } from '@/utils/supabase/server'

export async function uploadFile(file: File) {
    const supabase = await createClient()
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User must be authenticated to upload files')
    }

    const { data, error } = await supabase.storage.from('damsan').upload(`${user.id} / ${file.name}`, file)
    if (error) {
        console.error('Failed to upload file:', error)
    } else {
        console.log('File uploaded successfully:', data)
    }
}