import { login, signup } from '@/app/auth/login/actions'
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
export default function LoginPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
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
                                        placeholder="m@example.com"
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
                                    <Button className="w-full bg-blue-400 border-blue-400" formAction={login}>
                                        Login
                                    </Button>
                                    <Button className="w-full  border-gray-500" formAction={signup}>Sign up</Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>

    )
}       