import "@/app/globals.css";
import { spaceGrotesk } from "@/lib/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${spaceGrotesk.className} antialiased bg-white text-slate-900 min-h-svh`}>
        {children}
      </body>
    </html >
  );
}
