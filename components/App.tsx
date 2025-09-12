import { ChatWrapper } from "./ChatWrapper";
import { loadMessages } from "@/lib/db";
import { User } from "@supabase/supabase-js";
export default async function App({ user }: { user: User }) {
    const messages = await loadMessages(user!.id);
    return <ChatWrapper {...{ user, messages }} />;
}