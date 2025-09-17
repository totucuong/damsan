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

export default function WaitlistPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  return (
    <div className="flex flex-col min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="mb-6">
        <Image src="/logo.png" alt="Damsan.Life Logo" width={100} height={100} />
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
            {searchParams?.success && (
              <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
                Thanks! You’re on the list.
              </div>
            )}
            {searchParams?.error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {searchParams.error === "missing_email"
                  ? "Please enter a valid email."
                  : "Something went wrong. Please try again."}
              </div>
            )}
            <form action={joinWaitlist}>
              <div className="grid gap-3">
                <div className="grid gap-3">
                  <Label htmlFor="firstname">First name</Label>
                  <Input id="firstname" name="firstname" type="text" placeholder="Jane" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="lastname">Last name</Label>
                  <Input id="lastname" name="lastname" type="text" placeholder="Doe" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="flex flex-col gap-3">
                  <Button className="w-full" type="submit">
                    Join
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Prefer to sign up now?{" "}
                    <Link href="/auth/signup" className="underline underline-offset-4">
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
