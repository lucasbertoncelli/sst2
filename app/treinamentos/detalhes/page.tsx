"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GraduationCap, User, Calendar, MapPin, Users, DollarSign, Clock, Star, CheckCircle, Save } from "lucide-react"

export default function DetalhesDosTreinamentosPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Estados do formulário
  const [formData, setFormData] = useState({
    local: "",
    numeroParticipantes: "",
    custoTotal: "",
    custoPorPessoa: "",
    cargaHoraria: "",
    avaliacaoSatisfacao: "",
    observacoesAdministrativas: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Dados simulados do treinamento (normalmente viriam de props ou API)
  const treinamentoInfo = {
    titulo: "NR-12 Segurança em Máquinas",
    funcionario: "João Silva",
    setor: "Produção",
    dataRealizacao: "14/01/2024",
    status: "Concluído",
  }

  // Calcular custo por pessoa automaticamente
  React.useEffect(() => {
    const custoTotal = Number.parseFloat(formData.custoTotal) || 0
    const numeroParticipantes = Number.parseInt(formData.numeroParticipantes) || 0

    if (custoTotal > 0 && numeroParticipantes > 0) {
      const custoPorPessoa = (custoTotal / numeroParticipantes).toFixed(2)
      setFormData((prev) => ({
        ...prev,
        custoPorPessoa,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        custoPorPessoa: "",
      }))
    }
  }, [formData.custoTotal, formData.numeroParticipantes])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.local.trim()) {
      newErrors.local = "Local é obrigatório"
    }

    if (!formData.numeroParticipantes || Number.parseInt(formData.numeroParticipantes) <= 0) {
      newErrors.numeroParticipantes = "Número de participantes deve ser maior que 0"
    }

    if (!formData.cargaHoraria || Number.parseFloat(formData.cargaHoraria) <= 0) {
      newErrors.cargaHoraria = "Carga horária deve ser maior que 0"
    }

    if (!formData.avaliacaoSatisfacao) {
      newErrors.avaliacaoSatisfacao = "Avaliação de satisfação é obrigatória"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      console.log("Dados complementares do treinamento salvos:", formData)

      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mostrar mensagem de sucesso
      setSuccessMessage("Dados complementares do treinamento salvos com sucesso!")

      // Limpar formulário após sucesso
      setTimeout(() => {
        setFormData({
          local: "",
          numeroParticipantes: "",
          custoTotal: "",
          custoPorPessoa: "",
          cargaHoraria: "",
          avaliacaoSatisfacao: "",
          observacoesAdministrativas: "",
        })
        setSuccessMessage(null)
      }, 3000)
    } catch (error) {
      console.error("Erro ao salvar:", error)
      alert("Erro ao salvar. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (value: string): string => {
    if (!value) return "R$ 0,00"
    const numValue = Number.parseFloat(value)
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numValue)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Detalhes dos Treinamentos</h1>
        <p className="text-muted-foreground">Complete as informações complementares sobre os treinamentos realizados</p>
      </div>

      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Card com informações básicas do treinamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Informações do Treinamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Treinamento</p>
              <p className="font-semibold">{treinamentoInfo.titulo}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Funcionário</p>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-semibold">{treinamentoInfo.funcionario}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Data de Realização</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{treinamentoInfo.dataRealizacao}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant="default">{treinamentoInfo.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de dados complementares */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Dados Complementares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Local */}
            <div className="space-y-2">
              <Label htmlFor="local" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Local <span className="text-red-500">*</span>
              </Label>
              <Input
                id="local"
                placeholder="Ex: Sala de Treinamento A, Auditório Principal"
                value={formData.local}
                onChange={(e) => handleInputChange("local", e.target.value)}
                className={errors.local ? "border-red-500" : ""}
              />
              {errors.local && <p className="text-sm text-red-500">{errors.local}</p>}
            </div>

            {/* Grid com campos numéricos */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Número de Participantes */}
              <div className="space-y-2">
                <Label htmlFor="numeroParticipantes" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Nº de Participantes <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="numeroParticipantes"
                  type="number"
                  min="1"
                  placeholder="Ex: 15"
                  value={formData.numeroParticipantes}
                  onChange={(e) => handleInputChange("numeroParticipantes", e.target.value)}
                  className={errors.numeroParticipantes ? "border-red-500" : ""}
                />
                {errors.numeroParticipantes && <p className="text-sm text-red-500">{errors.numeroParticipantes}</p>}
              </div>

              {/* Carga Horária */}
              <div className="space-y-2">
                <Label htmlFor="cargaHoraria" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Carga Horária (horas) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cargaHoraria"
                  type="number"
                  min="0.5"
                  step="0.5"
                  placeholder="Ex: 8"
                  value={formData.cargaHoraria}
                  onChange={(e) => handleInputChange("cargaHoraria", e.target.value)}
                  className={errors.cargaHoraria ? "border-red-500" : ""}
                />
                {errors.cargaHoraria && <p className="text-sm text-red-500">{errors.cargaHoraria}</p>}
              </div>
            </div>

            {/* Grid com custos */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Custo Total */}
              <div className="space-y-2">
                <Label htmlFor="custoTotal" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Custo Total (R$)
                </Label>
                <Input
                  id="custoTotal"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex: 5000.00"
                  value={formData.custoTotal}
                  onChange={(e) => handleInputChange("custoTotal", e.target.value)}
                />
              </div>

              {/* Custo por Pessoa (calculado automaticamente) */}
              <div className="space-y-2">
                <Label htmlFor="custoPorPessoa" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Custo por Pessoa (calculado automaticamente)
                </Label>
                <Input
                  id="custoPorPessoa"
                  value={formData.custoPorPessoa ? formatCurrency(formData.custoPorPessoa) : ""}
                  disabled
                  className="bg-gray-50"
                  placeholder="Será calculado automaticamente"
                />
                <p className="text-xs text-gray-500">Calculado automaticamente: Custo Total ÷ Nº de Participantes</p>
              </div>
            </div>

            {/* Avaliação de Satisfação */}
            <div className="space-y-2">
              <Label htmlFor="avaliacaoSatisfacao" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Avaliação de Satisfação <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.avaliacaoSatisfacao}
                onValueChange={(value) => handleInputChange("avaliacaoSatisfacao", value)}
              >
                <SelectTrigger className={errors.avaliacaoSatisfacao ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione a avaliação de satisfação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excelente">⭐⭐⭐⭐⭐ Excelente</SelectItem>
                  <SelectItem value="Muito Bom">⭐⭐⭐⭐ Muito Bom</SelectItem>
                  <SelectItem value="Bom">⭐⭐⭐ Bom</SelectItem>
                  <SelectItem value="Regular">⭐⭐ Regular</SelectItem>
                  <SelectItem value="Ruim">⭐ Ruim</SelectItem>
                </SelectContent>
              </Select>
              {errors.avaliacaoSatisfacao && <p className="text-sm text-red-500">{errors.avaliacaoSatisfacao}</p>}
            </div>

            {/* Observações Administrativas */}
            <div className="space-y-2">
              <Label htmlFor="observacoesAdministrativas">Observações Administrativas</Label>
              <Textarea
                id="observacoesAdministrativas"
                placeholder="Informações adicionais sobre o treinamento, feedback dos participantes, pontos de melhoria, etc."
                value={formData.observacoesAdministrativas}
                onChange={(e) => handleInputChange("observacoesAdministrativas", e.target.value)}
                rows={4}
              />
            </div>

            {/* Botão de salvar */}
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Salvando..." : "Salvar Dados Complementares"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Card de exemplo com dados preenchidos */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">💡 Exemplo de Preenchimento</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            <strong>Local:</strong> Sala de Treinamento A - 2º Andar
          </p>
          <p>
            <strong>Participantes:</strong> 12 funcionários
          </p>
          <p>
            <strong>Custo Total:</strong> R$ 3.600,00
          </p>
          <p>
            <strong>Custo por Pessoa:</strong> R$ 300,00 (calculado automaticamente)
          </p>
          <p>
            <strong>Carga Horária:</strong> 8 horas
          </p>
          <p>
            <strong>Avaliação:</strong> ⭐⭐⭐⭐ Muito Bom
          </p>
          <p>
            <strong>Observações:</strong> Treinamento bem avaliado pelos participantes. Sugestão de repetir
            semestralmente.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
