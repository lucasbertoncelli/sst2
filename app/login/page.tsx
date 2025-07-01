"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPending(true)

    const result = await login(formData.email, formData.password)
    setPending(false)

    if (result.success) {
      router.push("/")
    } else {
      if (result.error?.includes("Invalid login credentials")) {
        setError("E-mail ou senha inválidos.")
      } else if (result.error?.includes("Email not confirmed")) {
        setError("Por favor, confirme seu e-mail antes de fazer login.")
      } else {
        setError(result.error || "Ocorreu um erro desconhecido.")
      }
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src="/images/logo-domine-sst.png" alt="Domine SST" className="mx-auto h-16 w-auto" />
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Acesse sua conta para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={pending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={pending}
              />
            </div>
            <div className="text-right text-sm">
              <Link href="/recuperar-senha" className="text-primary hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="/cadastro" className="font-medium text-primary hover:underline">
              Registre-se
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
