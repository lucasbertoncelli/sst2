"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockFuncionarios, mockTreinamentos } from "@/lib/mock-data"
import type { RelTreinamentosFuncionario } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"

interface TreinamentoRealizadoFormProps {
  onSubmit: (data: Partial<RelTreinamentosFuncionario>) => void
  onCancel: () => void
  initialData?: RelTreinamentosFuncionario | null
}

export function TreinamentoRealizadoForm({ onSubmit, onCancel, initialData }: TreinamentoRealizadoFormProps) {
  const [formData, setFormData] = useState<Partial<RelTreinamentosFuncionario & { funcionarioIds: string[] }>>({
    funcionarioIds: initialData ? [initialData.funcionarioId] : [],
    treinamentoId: initialData?.treinamentoId || "",
    dataRealizacao: initialData?.dataRealizacao
      ? new Date(initialData.dataRealizacao).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    status: initialData?.status || "pendente",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
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

    if (!formData.funcionarioIds || formData.funcionarioIds.length === 0) {
      newErrors.funcionarioIds = "Selecione pelo menos um funcionário"
    }
    if (!formData.treinamentoId) newErrors.treinamentoId = "Treinamento é obrigatório"
    if (!formData.dataRealizacao) newErrors.dataRealizacao = "Data de realização é obrigatória"
    if (!formData.status) newErrors.status = "Status é obrigatório"

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
      await onSubmit({
        ...formData,
        dataRealizacao: formData.dataRealizacao ? new Date(formData.dataRealizacao) : undefined,
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Erro ao salvar. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="funcionarioIds">
            Funcionários <span className="text-red-500">*</span>
          </Label>
          <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
            <div className="flex items-center space-x-2 mb-2 pb-2 border-b">
              <Checkbox
                id="select-all"
                checked={formData.funcionarioIds?.length === mockFuncionarios.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleInputChange(
                      "funcionarioIds",
                      mockFuncionarios.map((f) => f.id),
                    )
                  } else {
                    handleInputChange("funcionarioIds", [])
                  }
                }}
              />
              <Label htmlFor="select-all" className="text-sm font-medium">
                Selecionar Todos
              </Label>
            </div>
            {mockFuncionarios.map((funcionario) => (
              <div key={funcionario.id} className="flex items-center space-x-2">
                <Checkbox
                  id={funcionario.id}
                  checked={formData.funcionarioIds?.includes(funcionario.id) || false}
                  onCheckedChange={(checked) => {
                    const currentIds = formData.funcionarioIds || []
                    if (checked) {
                      handleInputChange("funcionarioIds", [...currentIds, funcionario.id])
                    } else {
                      handleInputChange(
                        "funcionarioIds",
                        currentIds.filter((id) => id !== funcionario.id),
                      )
                    }
                  }}
                />
                <Label htmlFor={funcionario.id} className="text-sm">
                  {funcionario.nome} - {funcionario.setor}
                </Label>
              </div>
            ))}
          </div>
          {errors.funcionarioIds && <p className="text-sm text-red-500">{errors.funcionarioIds}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="treinamentoId">
            Treinamento <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.treinamentoId} onValueChange={(value) => handleInputChange("treinamentoId", value)}>
            <SelectTrigger className={errors.treinamentoId ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecione o treinamento" />
            </SelectTrigger>
            <SelectContent>
              {mockTreinamentos.map((treinamento) => (
                <SelectItem key={treinamento.id} value={treinamento.id}>
                  {treinamento.titulo} - {treinamento.tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.treinamentoId && <p className="text-sm text-red-500">{errors.treinamentoId}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataRealizacao">
            Data de Realização <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dataRealizacao"
            type="date"
            value={formData.dataRealizacao || ""}
            onChange={(e) => handleInputChange("dataRealizacao", e.target.value)}
            className={errors.dataRealizacao ? "border-red-500" : ""}
          />
          {errors.dataRealizacao && <p className="text-sm text-red-500">{errors.dataRealizacao}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
            <SelectTrigger className={errors.status ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting
            ? "Salvando..."
            : initialData
              ? "Atualizar"
              : `Registrar para ${formData.funcionarioIds?.length || 0} funcionário(s)`}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  )
}
