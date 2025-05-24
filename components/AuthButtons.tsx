"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/providers/AuthProvider"
import { Github, Mail } from "lucide-react"

interface AuthButtonsProps {
  tenantId?: string
}

export function AuthButtons({ tenantId }: AuthButtonsProps) {
  const { loginWithProvider, isLoading } = useAuth()

  const handleProviderLogin = async (provider: string) => {
    await loginWithProvider(provider)
  }

  return (
    <div className="grid w-full grid-cols-2 gap-4">
      <Button variant="outline" type="button" disabled={isLoading} onClick={() => handleProviderLogin("google")}>
        <Mail className="mr-2 h-4 w-4" />
        Google
      </Button>
      <Button variant="outline" type="button" disabled={isLoading} onClick={() => handleProviderLogin("github")}>
        <Github className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  )
}
