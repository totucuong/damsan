'use client'

import Link from "next/link";
import { Bone } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";


function ErrorMessage() {
    const searchParam = useSearchParams()
    const message = searchParam?.get('message')
    return message ? (
        <p className="text-center text-2xl">Sorry {message}</p>
    ) : (
        <p className="text-center text-2xl">Sorry, something went wrong!</p>
    )
}

export default function ErrorPage() {
    return (
        <div className="flex flex-col min-h-svh w-full items-center justify-center p-6 md:p-10">
            <Bone className="h-24 w-24 text-muted-foreground" />
            <Suspense fallback={<div>Loading error message...</div>}>
                <ErrorMessage />
            </Suspense>
            <Link href="/auth/login" className="underline underline-offset-4">
                Please login again
            </Link>
        </div>
    );
}