import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { joinWaitlist } from "@/lib/actions";

export const metadata = {
  title: "Join the waitlist",
};

export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="flex flex-col min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="mb-6">
        <Image
          src="/logo.png"
          alt="Damsan.Life Logo"
          width={100}
          height={100}
        />
      </div>
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Join the waitlist</CardTitle>
            <CardDescription>
              Be the first to know when we launch.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sp?.success && (
              <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
                Thanks! You’re on the list.
              </div>
            )}
            {sp?.error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {sp.error === "missing_email"
                  ? "Please enter a valid email."
                  : "Something went wrong. Please try again."}
              </div>
            )}
            <form action={joinWaitlist}>
              <div className="grid gap-3">
                <div className="grid gap-3">
                  <Label htmlFor="firstname">First name</Label>
                  <Input id="firstname" name="firstname" type="text" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="lastname">Last name</Label>
                  <Input id="lastname" name="lastname" type="text" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="flex flex-col gap-3">
                  <Button className="w-full" type="submit">
                    Join
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
