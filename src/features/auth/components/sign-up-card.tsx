import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import React, { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { SignInFlow } from "../types"
import { TriangleAlert } from "lucide-react"
import { useAuthActions } from "@convex-dev/auth/react"

interface SignUpCardProps {
    setState: (state: SignInFlow) => void
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
    const { signIn } = useAuthActions();

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [pending, setPending] = useState(false)
    const [error, setError] = useState("")

    const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return;
        }

        setPending(true)
        signIn("password", { name, email, password, flow: "signUp" }).catch(() => { setError("Invalid email or password {SIGNUPCARD}") }).finally(() => { setPending(false) })
    }

    const onProviderSignUp = (value: "github" | "google") => {
        setPending(true)
        signIn(value).finally(() => {
            setPending(false)
        })
    }

    return (
        <div>
            <div >
                <div>
                    Sign Up to continue
                </div>
                <div className="">
                    use your email
                </div>
            </div>
            {!!error && (
                <div>
                    <TriangleAlert className="size-4" />
                    <p>{error}</p>
                </div>
            )}
            <div >
                <form onSubmit={onPasswordSignUp} >
                    <Input
                        disabled={pending} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" type="text" required
                    />
                    <Input
                        disabled={pending} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required
                    />
                    <Input
                        disabled={pending} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required
                    />
                    <Input
                        disabled={pending} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" type="password" required
                    />
                    <Button type="submit" size="lg" disabled={pending}>Continue</Button>
                </form>
                <Separator />
                <div >
                    <Button disabled={false} onClick={() => { }} variant="outline" size="lg" >
                        <FcGoogle  />
                        Continue with Google
                    </Button>
                    <Button disabled={false} onClick={() => onProviderSignUp("github")} variant="outline" size="lg" >
                        <FaGithub className="size-5 absolute top-2.5 left-2.5" />
                        Continue with Github
                    </Button>
                </div>
                <p>
                    Already have an account? <span onClick={() => setState("signIn")} >Sign In</span>
                </p>
            </div>
        </div>
    )
}
