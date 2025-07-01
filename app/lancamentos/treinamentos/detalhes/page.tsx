"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  MapPin,
  Users,
  DollarSign,
  Clock,
  Star,
  FileText,
  CheckCircle,
  Edit,
  Trash2,
  Plus,
  AlertTriangle,
} from "lucide-react"

// Mock data para treinamentos disponíveis
const treinamentosDisponiveis = [
  {
    id: "1",
    titulo: "NR-12 Segurança em Máquinas",
    funcionario: "João Silva",
    dataRealizacao: "14/01/2024",
    status: "Concluído",
  },
  {
    id: "2",
    titulo: "Primeiros Socorros",
    funcionario: "Dr. Roberto Silva",
    dataRealizacao: "09/03/2023",
    status: "Concluído",
  },
  {
    id: "3",
    titulo: "Brigada de Incêndio",
    funcionario: "Capitão Marcos Oliveira",
    dataRealizacao: "19/05/2023",
    status: "Pendente",
  },
]

export default function DetalhesDosTreinamentos() {
  // Mock data para treinamentos com detalhes já preenchidos
  const [treinamentosComDetalhes, setTreinamentosComDetalhes] = useState([
    {
      id: "1",
      titulo: "NR-12 Segurança em Máquinas",
      funcionario: "João Silva",
      local: "Sala de Treinamento A",
      participantes: 15,
      custoTotal: "R$ 3.750,00",
      custoPorPessoa: "R$ 250,00",
      cargaHoraria: 8,
      satisfacao: "⭐⭐⭐⭐⭐ Excelente",
      dataPreenchimento: "15/01/2024",
    },
  ])

  const [treinamentoSelecionado, setTreinamentoSelecionado] = useState("")
  const [formData, setFormData] = useState({
    local: "",
    participantes: "",
    custoTotal: "",
    cargaHoraria: "",
    satisfacao: "",
    observacoes: "",
  })

  const [custoPorPessoa, setCustoPorPessoa] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState("")

  // Estados para o modal de confirmação de exclusão
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [treinamentoParaExcluir, setTreinamentoParaExcluir] = useState<string | null>(null)

  // Calcular custo por pessoa automaticamente
  const calcularCustoPorPessoa = (custo: string, participantes: string) => {
    const custoNum = Number.parseFloat(custo.replace(/[^\d,]/g, "").replace(",", "."))
    const participantesNum = Number.parseInt(participantes)

    if (custoNum > 0 && participantesNum > 0) {
      const resultado = custoNum / participantesNum
      return `R$ ${resultado.toFixed(2).replace(".", ",")}`
    }
    return ""
  }

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)

    // Calcular custo por pessoa quando custo total ou participantes mudarem
    if (field === "custoTotal" || field === "participantes") {
      const novoCustoPorPessoa = calcularCustoPorPessoa(
        field === "custoTotal" ? value : newFormData.custoTotal,
        field === "participantes" ? value : newFormData.participantes,
      )
      setCustoPorPessoa(novoCustoPorPessoa)
    }

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const formatarMoeda = (value: string) => {
    const numero = value.replace(/[^\d]/g, "")
    if (numero) {
      const valorFormatado = (Number.parseInt(numero) / 100).toFixed(2)
      return `R$ ${valorFormatado.replace(".", ",")}`
    }
    return ""
  }

  const handleCustoChange = (value: string) => {
    const valorFormatado = formatarMoeda(value)
    handleInputChange("custoTotal", valorFormatado)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!treinamentoSelecionado) {
      newErrors.treinamento = "Selecione um treinamento"
    }

    if (!formData.local.trim()) {
      newErrors.local = "Local é obrigatório"
    }

    if (!formData.participantes.trim()) {
      newErrors.participantes = "Número de participantes é obrigatório"
    } else if (Number.parseInt(formData.participantes) <= 0) {
      newErrors.participantes = "Número de participantes deve ser maior que zero"
    }

    if (!formData.cargaHoraria.trim()) {
      newErrors.cargaHoraria = "Carga horária é obrigatória"
    } else if (Number.parseFloat(formData.cargaHoraria) <= 0) {
      newErrors.cargaHoraria = "Carga horária deve ser maior que zero"
    }

    if (!formData.satisfacao) {
      newErrors.satisfacao = "Avaliação de satisfação é obrigatória"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      const novoTreinamento = {
        id: editandoId || Date.now().toString(),
        titulo: treinamentoInfo?.titulo || "",
        funcionario: treinamentoInfo?.funcionario || "",
        local: formData.local,
        participantes: Number.parseInt(formData.participantes),
        custoTotal: formData.custoTotal,
        custoPorPessoa,
        cargaHoraria: Number.parseFloat(formData.cargaHoraria),
        satisfacao:
          formData.satisfacao === "5"
            ? "⭐⭐⭐⭐⭐ Excelente"
            : formData.satisfacao === "4"
              ? "⭐⭐⭐⭐ Muito Bom"
              : formData.satisfacao === "3"
                ? "⭐⭐⭐ Bom"
                : formData.satisfacao === "2"
                  ? "⭐⭐ Regular"
                  : "⭐ Ruim",
        dataPreenchimento: new Date().toLocaleDateString("pt-BR"),
      }

      if (editandoId) {
        // Update existing
        setTreinamentosComDetalhes((prev) => prev.map((t) => (t.id === editandoId ? novoTreinamento : t)))
      } else {
        // Add new
        setTreinamentosComDetalhes((prev) => [...prev, novoTreinamento])
      }

      setSuccessMessage(
        editandoId ? "Dados complementares atualizados com sucesso!" : "Dados complementares salvos com sucesso!",
      )
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)

      // Reset form
      setFormData({
        local: "",
        participantes: "",
        custoTotal: "",
        cargaHoraria: "",
        satisfacao: "",
        observacoes: "",
      })
      setCustoPorPessoa("")
      setTreinamentoSelecionado("")
      setEditandoId(null)
    }
  }

  const handleEditar = (id: string) => {
    const treinamento = treinamentosComDetalhes.find((t) => t.id === id)
    if (treinamento) {
      setTreinamentoSelecionado(id)
      setFormData({
        local: treinamento.local,
        participantes: treinamento.participantes.toString(),
        custoTotal: treinamento.custoTotal,
        cargaHoraria: treinamento.cargaHoraria.toString(),
        satisfacao: treinamento.satisfacao.includes("5")
          ? "5"
          : treinamento.satisfacao.includes("4")
            ? "4"
            : treinamento.satisfacao.includes("3")
              ? "3"
              : treinamento.satisfacao.includes("2")
                ? "2"
                : "1",
        observacoes: "",
      })
      setCustoPorPessoa(treinamento.custoPorPessoa)
      setEditandoId(id)

      // Scroll to form
      setTimeout(() => {
        document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }

  const handleExcluirClick = (id: string) => {
    setTreinamentoParaExcluir(id)
    setShowDeleteDialog(true)
  }

  const confirmarExclusao = () => {
    if (treinamentoParaExcluir) {
      setTreinamentosComDetalhes((prev) => prev.filter((t) => t.id !== treinamentoParaExcluir))

      // Show success message
      setSuccessMessage("Treinamento excluído com sucesso!")
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)

      // If we're editing this item, clear the form
      if (editandoId === treinamentoParaExcluir) {
        setFormData({
          local: "",
          participantes: "",
          custoTotal: "",
          cargaHoraria: "",
          satisfacao: "",
          observacoes: "",
        })
        setCustoPorPessoa("")
        setTreinamentoSelecionado("")
        setEditandoId(null)
      }
    }

    setShowDeleteDialog(false)
    setTreinamentoParaExcluir(null)
  }

  const cancelarExclusao = () => {
    setShowDeleteDialog(false)
    setTreinamentoParaExcluir(null)
  }

  const treinamentoInfo = treinamentosDisponiveis.find((t) => t.id === treinamentoSelecionado)
  const treinamentoParaExcluirInfo = treinamentosComDetalhes.find((t) => t.id === treinamentoParaExcluir)

  return (
    <div className="w-full px-6 py-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Detalhes dos Treinamentos</h2>
      <p className="text-gray-600 mb-6">Preencha os dados complementares dos treinamentos realizados</p>

      {/* Success Alert */}
      {showSuccess && (
        <Alert className="border-green-200 bg-green-50 mb-6">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage || "Dados complementares salvos com sucesso!"}
          </AlertDescription>
        </Alert>
      )}

      {/* Seleção de Treinamento */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-500" />
            Selecionar Treinamento
          </CardTitle>
          <CardDescription>Escolha o treinamento para preencher os dados complementares</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Treinamento *</Label>
            <Select value={treinamentoSelecionado} onValueChange={setTreinamentoSelecionado}>
              <SelectTrigger className={errors.treinamento ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione um treinamento realizado" />
              </SelectTrigger>
              <SelectContent>
                {treinamentosDisponiveis.map((treinamento) => (
                  <SelectItem key={treinamento.id} value={treinamento.id}>
                    {treinamento.titulo} - {treinamento.funcionario} - {treinamento.dataRealizacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.treinamento && <p className="text-sm text-red-600">{errors.treinamento}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Informações do Treinamento Selecionado */}
      {treinamentoInfo && (
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Star className="h-5 w-5" />
              Informações do Treinamento Selecionado
            </CardTitle>
            <CardDescription className="text-blue-700">
              {treinamentoInfo.titulo} - {treinamentoInfo.funcionario} - {treinamentoInfo.dataRealizacao} -{" "}
              {treinamentoInfo.status}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Form - só aparece se um treinamento estiver selecionado */}
      {treinamentoSelecionado && (
        <Card id="form-section" className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Dados Complementares
            </CardTitle>
            <CardDescription>Preencha as informações adicionais sobre o treinamento realizado</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Primeira linha - Local */}
              <div className="space-y-2">
                <Label htmlFor="local" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Local *
                </Label>
                <Input
                  id="local"
                  placeholder="Ex: Sala de Treinamento A, Auditório Principal"
                  value={formData.local}
                  onChange={(e) => handleInputChange("local", e.target.value)}
                  className={errors.local ? "border-red-500" : ""}
                />
                {errors.local && <p className="text-sm text-red-600">{errors.local}</p>}
              </div>

              {/* Segunda linha - Participantes e Carga Horária */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="participantes" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Nº de Participantes *
                  </Label>
                  <Input
                    id="participantes"
                    type="number"
                    min="1"
                    placeholder="10"
                    value={formData.participantes}
                    onChange={(e) => handleInputChange("participantes", e.target.value)}
                    className={errors.participantes ? "border-red-500" : ""}
                  />
                  {errors.participantes && <p className="text-sm text-red-600">{errors.participantes}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cargaHoraria" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Carga Horária (horas) *
                  </Label>
                  <Input
                    id="cargaHoraria"
                    type="number"
                    step="0.5"
                    min="0.5"
                    placeholder="Ex: 8"
                    value={formData.cargaHoraria}
                    onChange={(e) => handleInputChange("cargaHoraria", e.target.value)}
                    className={errors.cargaHoraria ? "border-red-500" : ""}
                  />
                  {errors.cargaHoraria && <p className="text-sm text-red-600">{errors.cargaHoraria}</p>}
                </div>
              </div>

              {/* Terceira linha - Custos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custoTotal" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Custo Total (R$)
                  </Label>
                  <Input
                    id="custoTotal"
                    placeholder="R$ 2500"
                    value={formData.custoTotal}
                    onChange={(e) => handleCustoChange(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Custo por Pessoa (calculado automaticamente)
                  </Label>
                  <Input value={custoPorPessoa} disabled className="bg-gray-50" placeholder="R$ 250,00" />
                  <p className="text-xs text-gray-500">Calculado automaticamente: Custo Total ÷ Nº de Participantes</p>
                </div>
              </div>

              {/* Quarta linha - Avaliação de Satisfação */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Avaliação de Satisfação *
                </Label>
                <Select value={formData.satisfacao} onValueChange={(value) => handleInputChange("satisfacao", value)}>
                  <SelectTrigger className={errors.satisfacao ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione a avaliação de satisfação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ Excelente (5 estrelas)</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ Muito Bom (4 estrelas)</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ Bom (3 estrelas)</SelectItem>
                    <SelectItem value="2">⭐⭐ Regular (2 estrelas)</SelectItem>
                    <SelectItem value="1">⭐ Ruim (1 estrela)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.satisfacao && <p className="text-sm text-red-600">{errors.satisfacao}</p>}
              </div>

              {/* Quinta linha - Observações */}
              <div className="space-y-2">
                <Label htmlFor="observacoes" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Observações Administrativas
                </Label>
                <Textarea
                  id="observacoes"
                  placeholder="Informações adicionais sobre o treinamento, feedback dos participantes, pontos de melhoria, etc."
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange("observacoes", e.target.value)}
                  rows={4}
                />
              </div>

              {/* Botão de Submit */}
              <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800">
                <CheckCircle className="h-4 w-4 mr-2" />
                {editandoId ? "Atualizar Dados Complementares" : "Salvar Dados Complementares"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tabela de Treinamentos com Detalhes */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Treinamentos com Detalhes Preenchidos
          </CardTitle>
          <CardDescription>Lista de treinamentos que já possuem dados complementares</CardDescription>
        </CardHeader>
        <CardContent>
          {treinamentosComDetalhes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum treinamento com detalhes preenchidos ainda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium">Treinamento</th>
                    <th className="text-left p-3 font-medium">Funcionário</th>
                    <th className="text-left p-3 font-medium">Local</th>
                    <th className="text-left p-3 font-medium">Participantes</th>
                    <th className="text-left p-3 font-medium">Custo Total</th>
                    <th className="text-left p-3 font-medium">Satisfação</th>
                    <th className="text-left p-3 font-medium">Data Preenchimento</th>
                    <th className="text-left p-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {treinamentosComDetalhes.map((treinamento) => (
                    <tr key={treinamento.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{treinamento.titulo}</td>
                      <td className="p-3">{treinamento.funcionario}</td>
                      <td className="p-3">{treinamento.local}</td>
                      <td className="p-3">{treinamento.participantes}</td>
                      <td className="p-3">{treinamento.custoTotal}</td>
                      <td className="p-3">{treinamento.satisfacao}</td>
                      <td className="p-3">{treinamento.dataPreenchimento}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditar(treinamento.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleExcluirClick(treinamento.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir os detalhes do treinamento{" "}
              <strong>"{treinamentoParaExcluirInfo?.titulo}"</strong>?
              <br />
              <br />
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelarExclusao}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmarExclusao}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
