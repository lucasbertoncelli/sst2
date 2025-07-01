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
import { AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function CadastroPage() {
  const { register } = useAuth()
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }
    if (formData.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.")
      return
    }

    setPending(true)
    const result = await register(formData.email, formData.password)
    setPending(false)

    if (result.success) {
      setSuccess("Cadastro realizado com sucesso! Verifique seu e-mail para confirmar sua conta.")
      setFormData({ email: "", password: "", confirmPassword: "" })
    } else {
      // Traduzir erros comuns do Supabase
      if (result.error?.includes("User already registered")) {
        setError("Este e-mail já está em uso.")
      } else if (result.error?.includes("Password should be at least")) {
        setError("A senha é muito fraca. Use pelo menos 6 caracteres.")
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
          <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
          <CardDescription>Preencha os campos para se registrar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="border-green-500 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
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
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={pending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repita sua senha"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                disabled={pending}
              />
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Registrando..." : "Registrar"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Faça login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
