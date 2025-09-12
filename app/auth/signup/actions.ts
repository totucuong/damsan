'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    // Normalize and collect form data
    const data = {
        email: (formData.get('email') as string)?.trim().toLowerCase(),
        password: formData.get('password') as string,
        firstname: (formData.get('firstname') as string) || undefined,
        lastname: (formData.get('lastname') as string) || undefined,
    }
    console.log('signup data', data)
    const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                firstname: data.firstname,
                lastname: data.lastname,
            },
        },
    })

    // Supabase quirk: if the email already exists, signUp can return 200 OK with
    // data.user.identities being an empty array. Treat this as "user already exists".
    // See: https://supabase.com/docs/reference/javascript/auth-signup#notes
    const identities = signUpData?.user?.identities
    const emailAlreadyRegistered = Array.isArray(identities) && identities.length === 0

    if (error || emailAlreadyRegistered) {
        // console.log('Signup error or duplicate email', { error, emailAlreadyRegistered })
        redirect(`/error?message=${'Email already registered'}`)
    }

    revalidatePath('/app', 'layout')
    redirect('/app')
}

