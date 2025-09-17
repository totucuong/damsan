import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "You're on the list!",
};

export default function WaitlistThanksPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="Damsan.Life Logo"
            width={80}
            height={80}
          />
        </div>
        <h1 className="text-2xl font-semibold">
          Thanks for joining the waitlist!
        </h1>
        <p className="mt-3 text-slate-600">
          We’ll email you as soon as we’re ready. In the meantime, feel free to
          follow along from the homepage.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
          {/* <Button variant="outline" asChild>
            <Link href="/auth/signup">Create an account</Link>
          </Button> */}
        </div>
      </div>
    </main>
  );
}
