"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthService } from "@/lib/auth"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function RedefinirSenhaPage() {
  const [formData, setFormData] = useState({
    senha: "",
    confirmarSenha: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const router = useRouter()
  const params = useParams()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setPending(true)

    // Validações
    if (!formData.senha || !formData.confirmarSenha) {
      setError("Todos os campos são obrigatórios")
      setPending(false)
      return
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem")
      setPending(false)
      return
    }

    if (formData.senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setPending(false)
      return
    }

    try {
      const authService = AuthService.getInstance()
      const result = await authService.resetPassword(formData.senha)

      if (result.success) {
        setSuccess("Senha redefinida com sucesso! Redirecionando para o login...")

        // Limpar formulário
        setFormData({
          senha: "",
          confirmarSenha: "",
        })

        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setError(result.error || "Erro ao redefinir senha")
      }
    } catch (err) {
      console.error("Erro na redefinição:", err)
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
          <CardTitle className="text-2xl">Redefinir Senha</CardTitle>
          <p className="text-sm text-muted-foreground">Digite sua nova senha</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="senha">Nova Senha</Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.senha}
                onChange={handleInputChange}
                disabled={pending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
              <Input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                placeholder="Digite a senha novamente"
                value={formData.confirmarSenha}
                onChange={handleInputChange}
                disabled={pending}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Redefinindo..." : "Redefinir Senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
