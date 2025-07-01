"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RecuperarSenhaPage() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setPending(true)

    // Validar e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Por favor, insira um e-mail válido")
      setPending(false)
      return
    }

    try {
      const result = await requestPasswordReset(email)

      if (result.success) {
        setSuccess("E-mail de recuperação enviado! Verifique sua caixa de entrada.")
        setEmail("")
      } else {
        let errorMessage = result.error || "Erro ao enviar e-mail de recuperação"

        // Traduzir erros comuns
        if (errorMessage.includes("User not found")) {
          errorMessage = "E-mail não encontrado"
        } else if (errorMessage.includes("Email rate limit exceeded")) {
          errorMessage = "Muitas tentativas. Tente novamente em alguns minutos"
        }

        setError(errorMessage)
      }
    } catch (err) {
      console.error("Erro na recuperação:", err)
      setError("Erro interno. Tente novamente.")
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img src="/images/logo-domine-sst.png" alt="Domine SST" className="h-16 w-auto object-contain" />
          </div>
          <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
          <p className="text-sm text-gray-600">Digite seu e-mail para receber as instruções de recuperação</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={pending}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Enviando..." : "Enviar E-mail de Recuperação"}
            </Button>
          </form>

          <div className="text-center">
            <Link href="/login" className="inline-flex items-center text-sm text-primary hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Voltar para o login
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
