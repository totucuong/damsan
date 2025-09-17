import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export const metadata = {
  title: "Damsan - Your Health Secretary",
  description:
    "Capture medical records and medicines you've taken using AI. Join the waitlist to get early access.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b">
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Damsan.life" width={64} height={64} />
          <span className="text-lg font-bold tracking-wide uppercase">
            Damsan <Heart className="w-4 h-4" /> life
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* <Link href="/auth/login" className="text-sm text-slate-600 hover:text-slate-900">
            Log in
          </Link> */}
          {/* <Button asChild>
            <Link href="/auth/signup">Join the waitlist</Link>
          </Button> */}
        </div>
      </header>

      <section className="container mx-auto px-6 pt-12 pb-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-wide text-slate-900">
            Your health secretary
          </h1>
          <p className="mt-5 text-lg text-slate-600">
            Damsan helps you capture and organize your medical records and
            prescriptions—fast, private, and effortless.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Join the waitlist</Link>
            </Button>
            {/* <Button size="lg" variant="outline" asChild>
              <Link href="/app">I already have access</Link>
            </Button> */}
          </div>
        </div>

        <div className="mt-16 grid place-items-center">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/10]">
            <Image
              src="/app.png"
              alt="App preview"
              fill
              priority
              sizes="(min-width: 1880px) 1800px, (min-width: 768px) 90vw, 100vw"
              className="object-contain p-2 sm:p-4"
            />
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-6 py-10 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Daki Bio, Inc. All rights reserved.</p>
      </footer>
    </main>
  );
}
