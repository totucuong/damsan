import { ChatWrapper } from "./ChatWrapper";
import { loadMessages } from "@/lib/db";
export default async function App({ userId }: { userId: string }) {
    const messages = await loadMessages(userId);
    console.log(messages);
    return <ChatWrapper userId={userId} messages={messages} />;
}