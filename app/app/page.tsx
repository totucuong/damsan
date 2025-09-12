import { redirect } from 'next/navigation'
import App from "@/components/App";
import { createClient } from '@/utils/supabase/server'

export default async function AppHome() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  return <App user={data.user} />;
}
