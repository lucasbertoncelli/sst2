"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DataForm } from "@/components/data-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, GraduationCap } from "lucide-react"
import { mockTreinamentos } from "@/lib/mock-data"
import type { Treinamento } from "@/types"

export default function TreinamentoDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const [treinamento, setTreinamento] = useState<Treinamento | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = params.id as string
    const foundTreinamento = mockTreinamentos.find((t) => t.id === id)
    setTreinamento(foundTreinamento || null)
    setLoading(false)
  }, [params.id])

  const handleSubmit = (formData: any) => {
    console.log("Dados complementares salvos:", formData)

    // Aqui você salvaria os dados complementares
    // Por enquanto, apenas mostra uma mensagem de sucesso
    alert("Dados complementares salvos com sucesso!")

    // Redireciona de volta para a lista de treinamentos
    router.push("/treinamentos")
  }

  const handleCancel = () => {
    router.push("/treinamentos")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!treinamento) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Treinamento não encontrado</h2>
          <p className="text-sm text-gray-600 mb-4">O treinamento solicitado não foi encontrado.</p>
          <Button onClick={() => router.push("/treinamentos")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Treinamentos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/treinamentos")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Preencher Dados Complementares</h1>
          <p className="text-muted-foreground">
            Treinamento: <strong>{treinamento.titulo}</strong>
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Informações Complementares do Treinamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataForm
            model="treinamento_detalhes"
            fields={[
              "local",
              "area",
              "totalDias",
              "horas",
              "quantidadeParticipantes",
              "custoTotal",
              "satisfacaoGeral",
              "custoPorParticipante",
              "custoPorHora",
              "custoPorHoraPorParticipante",
              "observacoesGerais",
            ]}
            submitLabel="Salvar Dados"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            title=""
          />
        </CardContent>
      </Card>
    </div>
  )
}
