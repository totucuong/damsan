import { ChatInput } from "./ChatInput";
import { Memory } from "./Memory";
export function App({ userId }: { userId: string }) {
    return (
        <>
            <h1>Daki Life</h1>
            <Memory userId={userId} />
            {/* <ChatInput /> */}
        </>
    );
}