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
import { signup } from './actions'

export default function SignupPage() {
    return (
        <div className="flex flex-col min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="mb-6">
                <Image src="/logo.png" alt="Damsan.Life Logo" width={100} height={100} />
            </div>
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle>Create your account</CardTitle>
                        <CardDescription>Enter your details to sign up</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={signup}>
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
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                    </div>
                                    <Input id="password" name="password" type="password" required />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button className="w-full" type="submit">
                                        Sign up
                                    </Button>
                                    <p className="text-center text-sm text-muted-foreground">
                                        Already have an account?{' '}
                                        <Link href="/auth/login" className="underline underline-offset-4">
                                            Log in here
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
