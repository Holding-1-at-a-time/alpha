import { LoginForm } from "@/components/LoginForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - Project Alpha",
  description: "Sign in to your Project Alpha account",
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { tenant?: string }
}) {
  const tenantId = searchParams.tenant || undefined

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
        </div>
        <LoginForm tenantId={tenantId} />
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <a href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}
