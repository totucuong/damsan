import { ChatInput } from "./ChatInput";
import { Memory } from "./Memory";
export function App({ userId }: { userId: string }) {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold">Daki Life</h1>
            <div>
                <Memory userId={userId} />
                <ChatInput />
            </div>
        </div>
    );
}