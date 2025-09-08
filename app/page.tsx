import { redirect } from 'next/navigation'
import App from "@/components/App";
import { createClient } from '@/utils/supabase/server'


export default async function Home() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  return <App userId="8d3e9345-e1e9-459c-b453-9fc229a9511f" />;
}
