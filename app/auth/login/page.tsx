import { login } from '@/app/auth/login/actions'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
export default function LoginPage() {
    return (
        <div className="flex flex-col min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="mb-6">
                <Image src="/logo.png" alt="Damsan.Life Logo" width={100} height={100} />
            </div>
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle>Login to your account</CardTitle>
                        <CardDescription>Enter your email and password to log in</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid gap-3">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                    </div>
                                    <Input id="password" name="password" type="password" required />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button className="w-full" formAction={login}>
                                        Login
                                    </Button>
                                    <p className="text-center text-sm text-muted-foreground">
                                        Don&apos;t have an account yet?
                                        <Link href="/auth/signup" className="underline underline-offset-4">
                                            Sign up here
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>

    )
}       