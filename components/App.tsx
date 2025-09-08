import { ChatWrapper } from "./ChatWrapper";
import { loadMessages } from "@/lib/db";
export default async function App({ userId }: { userId: string }) {
    const messages = await loadMessages(userId);
    return <ChatWrapper userId={userId} messages={messages} />;
}