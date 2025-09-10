'use server'
import { createClient } from '@/utils/supabase/server'

export async function uploadFile(file: File) {
    const supabase = await createClient()
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User must be authenticated to upload files')
    }

    const { data, error } = await supabase.storage.from(process.env.SUPABASE_BUCKET!).upload(`${user.id} / ${file.name}`, file)
    if (error) {
        throw new Error('Failed to upload file: ' + error.message)
    }
    return data
}