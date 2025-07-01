"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DataForm } from "@/components/data-form"
import type { Fornecedor } from "@/types"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"

// Type aliases to avoid generic syntax issues
type StringState = string
type FornecedorState = Fornecedor | null

export default function CadastroFornecedorPage() {
  const router = useRouter()
  const { profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<StringState>("")

  const fornecedorFields = [
    {
      name: "nome",
      label: "Nome do Fornecedor",
      type: "text" as const,
      required: true,
      placeholder: "Ex: Empresa ABC Ltda",
    },
    {
      name: "cnpj",
      label: "CNPJ",
      type: "text" as const,
      placeholder: "00.000.000/0000-00",
    },
    {
      name: "contato_nome",
      label: "Nome do Contato",
      type: "text" as const,
      placeholder: "Ex: João Silva",
    },
    {
      name: "contato_email",
      label: "E-mail do Contato",
      type: "email" as const,
      placeholder: "contato@empresa.com",
    },
    {
      name: "contato_telefone",
      label: "Telefone do Contato",
      type: "tel" as const,
      placeholder: "(11) 99999-9999",
    },
  ]

  const handleSubmit = async (data: Record<string, any>) => {
    if (!profile?.empresa_id) {
      setError("Usuário não autenticado ou empresa não identificada.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const fornecedorData = {
        ...data,
        empresa_id: profile.empresa_id,
      }

      const { error: insertError } = await supabase.from("fornecedores").insert([fornecedorData])

      if (insertError) {
        throw insertError
      }

      router.push("/fornecedores")
    } catch (err: any) {
      console.error("Erro ao cadastrar fornecedor:", err)
      setError(err.message || "Erro inesperado ao cadastrar fornecedor.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push("/fornecedores")
  }

  return (
    <div className="w-full px-6 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Cadastrar Fornecedor</h1>
        <p className="text-muted-foreground">Adicione um novo fornecedor ao sistema</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <DataForm
        fields={fornecedorFields}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        submitText="Cadastrar Fornecedor"
        cancelText="Cancelar"
      />
    </div>
  )
}
