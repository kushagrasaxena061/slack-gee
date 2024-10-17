"use client"

import React from 'react'
import { useRouter } from "next/navigation"
import { Button } from '@/components/ui/button'

// Make an early access page
// Join waitlist

export default function page() {
    const router = useRouter();
    return (
        <div>
            <div>Drafts and Send</div>
            <Button onClick={() => router.push("/")} variant="default">Join the waitlist</Button>
        </div>
    )
}