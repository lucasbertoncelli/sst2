"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Treinamento, Funcionario } from "@/types"

interface TreinamentoResponsavelFormProps {
  onSubmit: (data: Partial<Treinamento>) => void
  onCancel: () => void
  initialData?: Partial<Treinamento>
  funcionarios: Funcionario[]
}

export function TreinamentoResponsavelForm({
  onSubmit,
  onCancel,
  initialData,
  funcionarios,
}: TreinamentoResponsavelFormProps) {
  const [formData, setFormData] = useState<Partial<Treinamento>>({
    titulo: initialData?.titulo || "",
    tipo: initialData?.tipo || "",
    data_realizacao: initialData?.data_realizacao || undefined,
    validade: initialData?.validade || undefined,
    status: initialData?.status || "pendente",
    responsavel: {
      tipo: initialData?.responsavel_tipo || "funcionario",
      funcionarioId: initialData?.responsavel_funcionario_id || "",
      nomeResponsavel: initialData?.responsavel_terceirizado_nome || "",
      empresaResponsavel: initialData?.responsavel_terceirizado_empresa || "",
    },
    observacoes: initialData?.observacoes || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("informacoes")

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith("responsavel.")) {
      const responsavelField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        responsavel: {
          ...prev.responsavel!,
          [responsavelField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleResponsavelTipoChange = (tipo: "funcionario" | "terceirizado") => {
    setFormData((prev) => ({
      ...prev,
      responsavel: {
        tipo,
        funcionarioId: tipo === "funcionario" ? "" : undefined,
        nomeResponsavel: tipo === "terceirizado" ? "" : undefined,
        empresaResponsavel: tipo === "terceirizado" ? "" : undefined,
      },
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.titulo) newErrors.titulo = "Título é obrigatório"
    if (!formData.tipo) newErrors.tipo = "Tipo é obrigatório"
    if (!formData.data_realizacao) newErrors.data_realizacao = "Data de realização é obrigatória"
    if (!formData.validade) newErrors.validade = "Data de validade é obrigatória"
    if (!formData.status) newErrors.status = "Status é obrigatório"

    if (formData.responsavel?.tipo === "funcionario") {
      if (!formData.responsavel.funcionarioId) {
        newErrors["responsavel.funcionarioId"] = "Funcionário responsável é obrigatório"
      }
    } else if (formData.responsavel?.tipo === "terceirizado") {
      if (!formData.responsavel.nomeResponsavel) {
        newErrors["responsavel.nomeResponsavel"] = "Nome do responsável é obrigatório"
      }
      if (!formData.responsavel.empresaResponsavel) {
        newErrors["responsavel.empresaResponsavel"] = "Empresa responsável é obrigatória"
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0]
      if (firstErrorKey.startsWith("responsavel")) {
        setActiveTab("responsavel")
      } else {
        setActiveTab("informacoes")
      }
    }

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Erro ao salvar. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="informacoes">Informações</TabsTrigger>
            <TabsTrigger value="responsavel">Responsável</TabsTrigger>
            <TabsTrigger value="observacoes">Observações</TabsTrigger>
          </TabsList>

          <TabsContent value="informacoes" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">
                Título do Treinamento <span className="text-red-500">*</span>
              </Label>
              <Input
                id="titulo"
                placeholder="Ex: NR-12 Segurança em Máquinas"
                value={formData.titulo}
                onChange={(e) => handleInputChange("titulo", e.target.value)}
                className={errors.titulo ? "border-red-500" : ""}
              />
              {errors.titulo && <p className="text-sm text-red-500">{errors.titulo}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">
                  Tipo <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
                  <SelectTrigger className={errors.tipo ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Obrigatório">Obrigatório</SelectItem>
                    <SelectItem value="Capacitação">Capacitação</SelectItem>
                    <SelectItem value="Reciclagem">Reciclagem</SelectItem>
                    <SelectItem value="Integração">Integração</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipo && <p className="text-sm text-red-500">{errors.tipo}</p>}
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
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_realizacao">
                  Data de Realização <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="data_realizacao"
                  type="date"
                  value={formData.data_realizacao ? String(formData.data_realizacao).split("T")[0] : ""}
                  onChange={(e) => handleInputChange("data_realizacao", e.target.value)}
                  className={errors.data_realizacao ? "border-red-500" : ""}
                />
                {errors.data_realizacao && <p className="text-sm text-red-500">{errors.data_realizacao}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="validade">
                  Data de Validade <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="validade"
                  type="date"
                  value={formData.validade ? String(formData.validade).split("T")[0] : ""}
                  onChange={(e) => handleInputChange("validade", e.target.value)}
                  className={errors.validade ? "border-red-500" : ""}
                />
                {errors.validade && <p className="text-sm text-red-500">{errors.validade}</p>}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="responsavel" className="space-y-4 mt-4">
            <RadioGroup
              value={formData.responsavel?.tipo || "funcionario"}
              onValueChange={(value) => handleResponsavelTipoChange(value as "funcionario" | "terceirizado")}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="funcionario" id="funcionario" />
                <Label htmlFor="funcionario" className="font-medium">
                  Funcionário Interno
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="terceirizado" id="terceirizado" />
                <Label htmlFor="terceirizado" className="font-medium">
                  Terceirizado/Externo
                </Label>
              </div>
            </RadioGroup>

            {formData.responsavel?.tipo === "funcionario" && (
              <div className="space-y-2">
                <Label htmlFor="funcionarioId">
                  Funcionário Responsável <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.responsavel.funcionarioId || ""}
                  onValueChange={(value) => handleInputChange("responsavel.funcionarioId", value)}
                >
                  <SelectTrigger className={errors["responsavel.funcionarioId"] ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o funcionário" />
                  </SelectTrigger>
                  <SelectContent>
                    {funcionarios.map((funcionario) => (
                      <SelectItem key={funcionario.id} value={funcionario.id}>
                        {funcionario.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors["responsavel.funcionarioId"] && (
                  <p className="text-sm text-red-500">{errors["responsavel.funcionarioId"]}</p>
                )}
              </div>
            )}

            {formData.responsavel?.tipo === "terceirizado" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeResponsavel">
                    Nome do Responsável <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nomeResponsavel"
                    value={formData.responsavel.nomeResponsavel || ""}
                    onChange={(e) => handleInputChange("responsavel.nomeResponsavel", e.target.value)}
                    className={errors["responsavel.nomeResponsavel"] ? "border-red-500" : ""}
                  />
                  {errors["responsavel.nomeResponsavel"] && (
                    <p className="text-sm text-red-500">{errors["responsavel.nomeResponsavel"]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresaResponsavel">
                    Empresa <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="empresaResponsavel"
                    value={formData.responsavel.empresaResponsavel || ""}
                    onChange={(e) => handleInputChange("responsavel.empresaResponsavel", e.target.value)}
                    className={errors["responsavel.empresaResponsavel"] ? "border-red-500" : ""}
                  />
                  {errors["responsavel.empresaResponsavel"] && (
                    <p className="text-sm text-red-500">{errors["responsavel.empresaResponsavel"]}</p>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="observacoes" className="space-y-4 mt-4">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes || ""}
              onChange={(e) => handleInputChange("observacoes", e.target.value)}
              rows={6}
            />
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-6 mt-6 border-t">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Treinamento"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
