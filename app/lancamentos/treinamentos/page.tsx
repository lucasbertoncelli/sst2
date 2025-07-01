"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/data-table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { mockFuncionarios, mockTreinamentos, mockRelTreinamentos, mockSetores } from "@/lib/mock-data"
import { useFilters } from "@/hooks/use-filters"
import {
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  GraduationCap,
  Plus,
} from "lucide-react"
import type { RelTreinamentosFuncionario } from "@/types"
import { TreinamentoRealizadoForm } from "@/components/forms/treinamento-realizado-form"

export default function LancamentosTreinamentosPage() {
  const router = useRouter()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [treinamentosRealizados, setTreinamentosRealizados] = useState(mockRelTreinamentos)
  const [editingTreinamento, setEditingTreinamento] = useState<RelTreinamentosFuncionario | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; treinamento: RelTreinamentosFuncionario | null }>({
    open: false,
    treinamento: null,
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [successDialog, setSuccessDialog] = useState<{ open: boolean; treinamentoId: string | null }>({
    open: false,
    treinamentoId: null,
  })

  // Configuração dos filtros
  const filterConfig = {
    funcionario: (item: RelTreinamentosFuncionario, value: string) =>
      item.funcionario?.nome.toLowerCase().includes(value.toLowerCase()) || false,
    setor: (item: RelTreinamentosFuncionario, value: string) =>
      item.funcionario?.setor.toLowerCase() === value.toLowerCase() || false,
    treinamento: (item: RelTreinamentosFuncionario, value: string) =>
      item.treinamento?.titulo.toLowerCase().includes(value.toLowerCase()) || false,
    tipo: (item: RelTreinamentosFuncionario, value: string) =>
      item.treinamento?.tipo.toLowerCase() === value.toLowerCase() || false,
    status: (item: RelTreinamentosFuncionario, value: string) => item.status.toLowerCase() === value.toLowerCase(),
    periodo: (item: RelTreinamentosFuncionario, value: string) => {
      if (!item.dataRealizacao) return false
      const realizacaoDate = new Date(item.dataRealizacao)
      const today = new Date()
      const diffTime = today.getTime() - realizacaoDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      switch (value) {
        case "7dias":
          return diffDays <= 7
        case "30dias":
          return diffDays <= 30
        case "90dias":
          return diffDays <= 90
        case "6meses":
          return diffDays <= 180
        case "1ano":
          return diffDays <= 365
        default:
          return true
      }
    },
    validade: (item: RelTreinamentosFuncionario, value: string) => {
      if (!item.treinamento?.validade) return false
      const today = new Date()
      const validade = new Date(item.treinamento.validade)
      const isExpired = validade < today
      const isExpiringSoon = (validade.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 30

      switch (value) {
        case "vencido":
          return isExpired
        case "vencendo":
          return !isExpired && isExpiringSoon
        case "valido":
          return !isExpired && !isExpiringSoon
        default:
          return true
      }
    },
  }

  const { filteredData, filters, updateFilter } = useFilters(treinamentosRealizados, filterConfig)

  // Aplicar filtro de busca por texto
  const searchFilteredData = filteredData.filter(
    (treinamento) =>
      treinamento.funcionario?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treinamento.funcionario?.setor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treinamento.treinamento?.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treinamento.treinamento?.tipo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const navigateToDetails = useCallback(
    (id: string) => {
      console.log("Navegando para detalhes do treinamento:", id)
      router.push(`/lancamentos/treinamentos/detalhes/${id}`)
    },
    [router],
  )

  const handleTreinamentoSubmit = (formData: Partial<RelTreinamentosFuncionario & { funcionarioIds: string[] }>) => {
    try {
      if (editingTreinamento) {
        // Editando treinamento existente (mantém lógica original)
        const funcionario = mockFuncionarios.find((f) => f.id === formData.funcionarioIds?.[0])
        const treinamento = mockTreinamentos.find((t) => t.id === formData.treinamentoId)

        if (!funcionario || !treinamento) {
          setErrorMessage("Erro: Funcionário ou Treinamento não encontrado!")
          return
        }

        const updatedTreinamento: RelTreinamentosFuncionario = {
          ...editingTreinamento,
          funcionarioId: formData.funcionarioIds![0],
          treinamentoId: formData.treinamentoId!,
          dataRealizacao: formData.dataRealizacao!,
          status: formData.status!,
          funcionario,
          treinamento,
        }

        setTreinamentosRealizados(
          treinamentosRealizados.map((t) => (t.id === editingTreinamento.id ? updatedTreinamento : t)),
        )
        setSuccessMessage(`Treinamento atualizado com sucesso!`)
        setEditingTreinamento(null)
        setModalOpen(false)
      } else {
        // Criando novos registros para múltiplos funcionários
        const treinamento = mockTreinamentos.find((t) => t.id === formData.treinamentoId)

        if (!treinamento) {
          setErrorMessage("Erro: Treinamento não encontrado!")
          return
        }

        const funcionarioIds = formData.funcionarioIds || []
        const funcionarios = mockFuncionarios.filter((f) => funcionarioIds.includes(f.id))

        if (funcionarios.length === 0) {
          setErrorMessage("Erro: Nenhum funcionário válido selecionado!")
          return
        }

        // Verificar se já existem registros para algum dos funcionários
        const funcionariosComRegistro = funcionarios.filter((funcionario) =>
          treinamentosRealizados.some(
            (t) => t.funcionarioId === funcionario.id && t.treinamentoId === formData.treinamentoId,
          ),
        )

        if (funcionariosComRegistro.length > 0) {
          const nomes = funcionariosComRegistro.map((f) => f.nome).join(", ")
          setErrorMessage(`Os seguintes funcionários já possuem registro para este treinamento: ${nomes}`)
          return
        }

        // Criar registros para todos os funcionários selecionados
        const novosTreinamentos: RelTreinamentosFuncionario[] = funcionarios.map((funcionario) => ({
          id: `${Date.now()}-${funcionario.id}`,
          funcionarioId: funcionario.id,
          treinamentoId: formData.treinamentoId!,
          dataRealizacao: formData.dataRealizacao!,
          status: formData.status!,
          funcionario,
          treinamento,
        }))

        // Adicionar os novos treinamentos ao estado
        const updatedTreinamentos = [...treinamentosRealizados, ...novosTreinamentos]
        setTreinamentosRealizados(updatedTreinamentos)

        // Mostrar dialog de sucesso para preencher dados complementares
        setSuccessDialog({ open: true, treinamentoId: novosTreinamentos[0].id })
        setModalOpen(false)
      }

      setErrorMessage(null)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error) {
      console.error("Erro ao salvar treinamento:", error)
      setErrorMessage("Erro interno ao salvar treinamento. Tente novamente.")
      setSuccessMessage(null)
    }
  }

  const handleEditTreinamento = (treinamento: RelTreinamentosFuncionario) => {
    setEditingTreinamento(treinamento)
    setModalOpen(true)
  }

  const openDeleteDialog = (treinamento: RelTreinamentosFuncionario) => {
    setDeleteDialog({ open: true, treinamento })
  }

  const handleDeleteTreinamento = () => {
    if (deleteDialog.treinamento) {
      setTreinamentosRealizados(treinamentosRealizados.filter((t) => t.id !== deleteDialog.treinamento!.id))
      setSuccessMessage(`Registro de treinamento excluído com sucesso!`)
      setDeleteDialog({ open: false, treinamento: null })

      // Limpar mensagem após 5 segundos
      setTimeout(() => setSuccessMessage(null), 5000)
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingTreinamento(null)
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    updateFilter("funcionario", "todos")
    updateFilter("setor", "todos")
    updateFilter("treinamento", "todos")
    updateFilter("tipo", "todos")
    updateFilter("status", "todos")
    updateFilter("periodo", "todos")
    updateFilter("validade", "todos")
  }

  // Função para formatar data corretamente
  const formatDate = (date: Date): string => {
    if (!date) return "-"

    try {
      const dateObj = new Date(date)
      if (isNaN(dateObj.getTime())) return "-"
      return dateObj.toLocaleDateString("pt-BR")
    } catch (error) {
      console.error("Erro ao formatar data:", error)
      return "-"
    }
  }

  // Colunas para a tabela de treinamentos realizados
  const treinamentoColumns = [
    { key: "funcionario.nome", label: "Funcionário" },
    { key: "funcionario.setor", label: "Setor" },
    { key: "treinamento.titulo", label: "Treinamento" },
    { key: "treinamento.tipo", label: "Tipo" },
    {
      key: "dataRealizacao",
      label: "Data Realização",
      render: (value: Date) => formatDate(value),
    },
    {
      key: "treinamento.validade",
      label: "Validade",
      render: (value: Date, row: RelTreinamentosFuncionario) => {
        if (!value) return "-"

        const date = new Date(value)
        const today = new Date()
        const daysUntilExpiry = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        return (
          <div className="flex items-center gap-2">
            {formatDate(date)}
            {daysUntilExpiry <= 30 && (
              <Badge variant="destructive" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {daysUntilExpiry <= 0 ? "Vencido" : `${daysUntilExpiry}d`}
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        const variants = {
          concluido: "default",
          pendente: "secondary",
        } as const
        return (
          <Badge variant={variants[value as keyof typeof variants] || "outline"} className="text-xs">
            {value === "concluido" ? "Concluído" : "Pendente"}
          </Badge>
        )
      },
    },
    {
      key: "actions",
      label: "Ações",
      render: (value: any, row: RelTreinamentosFuncionario) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleEditTreinamento(row)}>
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(row)}>
            <Trash2 className="w-4 h-4 mr-1" />
            Excluir
          </Button>
        </div>
      ),
    },
  ]

  // Verificar se há filtros ativos
  const hasActiveFilters =
    searchTerm ||
    (filters.funcionario && filters.funcionario !== "todos") ||
    (filters.setor && filters.setor !== "todos") ||
    (filters.treinamento && filters.treinamento !== "todos") ||
    (filters.tipo && filters.tipo !== "todos") ||
    (filters.status && filters.status !== "todos") ||
    (filters.periodo && filters.periodo !== "todos") ||
    (filters.validade && filters.validade !== "todos")

  // Estatísticas
  const totalTreinamentos = treinamentosRealizados.length
  const treinamentosConcluidos = treinamentosRealizados.filter((t) => t.status === "concluido").length
  const treinamentosPendentes = treinamentosRealizados.filter((t) => t.status === "pendente").length
  const treinamentosVencidos = treinamentosRealizados.filter((t) => {
    if (!t.treinamento?.validade) return false
    const today = new Date()
    const validade = new Date(t.treinamento.validade)
    return validade < today
  }).length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Treinamentos Realizados</h1>
          <p className="text-muted-foreground">Registre e controle os treinamentos realizados pelos funcionários</p>
        </div>
        <>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Lançar Treinamento
          </Button>

          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTreinamento ? "Editar Treinamento Realizado" : "Lançamento de Treinamento Realizado"}
                </DialogTitle>
                <DialogDescription>
                  {editingTreinamento
                    ? "Edite as informações do treinamento realizado"
                    : "Registre um novo treinamento realizado pelos funcionários"}
                </DialogDescription>
              </DialogHeader>
              <TreinamentoRealizadoForm
                onSubmit={handleTreinamentoSubmit}
                onCancel={handleModalClose}
                initialData={editingTreinamento}
              />
            </DialogContent>
          </Dialog>
        </>
      </div>

      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Registros</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTreinamentos}</div>
            <p className="text-xs text-muted-foreground">Treinamentos registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{treinamentosConcluidos}</div>
            <p className="text-xs text-muted-foreground">
              {totalTreinamentos > 0 ? Math.round((treinamentosConcluidos / totalTreinamentos) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{treinamentosPendentes}</div>
            <p className="text-xs text-muted-foreground">Aguardando conclusão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{treinamentosVencidos}</div>
            <p className="text-xs text-muted-foreground">Requer atenção</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de treinamentos com filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Treinamentos Realizados ({searchFilteredData.length} registros)
            {hasActiveFilters && <Badge variant="secondary">Filtros ativos</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
            {/* Busca por texto */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Filtro por funcionário */}
            <Select
              value={filters.funcionario || "todos"}
              onValueChange={(value) => updateFilter("funcionario", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Funcionário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os funcionários</SelectItem>
                {mockFuncionarios.map((funcionario) => (
                  <SelectItem key={funcionario.id} value={funcionario.nome}>
                    {funcionario.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro por setor */}
            <Select value={filters.setor || "todos"} onValueChange={(value) => updateFilter("setor", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os setores</SelectItem>
                {mockSetores.map((setor) => (
                  <SelectItem key={setor.id} value={setor.nome}>
                    {setor.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro por treinamento */}
            <Select
              value={filters.treinamento || "todos"}
              onValueChange={(value) => updateFilter("treinamento", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Treinamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os treinamentos</SelectItem>
                {mockTreinamentos.map((treinamento) => (
                  <SelectItem key={treinamento.id} value={treinamento.titulo}>
                    {treinamento.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro por tipo */}
            <Select value={filters.tipo || "todos"} onValueChange={(value) => updateFilter("tipo", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="obrigatório">Obrigatório</SelectItem>
                <SelectItem value="capacitação">Capacitação</SelectItem>
                <SelectItem value="reciclagem">Reciclagem</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por status */}
            <Select value={filters.status || "todos"} onValueChange={(value) => updateFilter("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por período */}
            <Select value={filters.periodo || "todos"} onValueChange={(value) => updateFilter("periodo", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os períodos</SelectItem>
                <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="90dias">Últimos 90 dias</SelectItem>
                <SelectItem value="6meses">Últimos 6 meses</SelectItem>
                <SelectItem value="1ano">Último ano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro adicional por validade */}
          <div className="flex gap-4">
            <Select value={filters.validade || "todos"} onValueChange={(value) => updateFilter("validade", value)}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Status de Validade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as validades</SelectItem>
                <SelectItem value="valido">Válido</SelectItem>
                <SelectItem value="vencendo">Vencendo (30 dias)</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>

            {/* Botão para limpar filtros */}
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearAllFilters} size="sm">
                Limpar Filtros
              </Button>
            )}
          </div>

          {/* Tabela */}
          <DataTable data={searchFilteredData.slice().reverse()} columns={treinamentoColumns} />

          {/* Mensagem quando não há resultados */}
          {searchFilteredData.length === 0 && treinamentosRealizados.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhum treinamento encontrado</p>
              <p className="text-sm">Tente ajustar os filtros para ver mais resultados</p>
            </div>
          )}

          {/* Mensagem quando não há treinamentos cadastrados */}
          {treinamentosRealizados.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhum treinamento registrado</p>
              <p className="text-sm">Use o botão "Lançar Treinamento" para registrar o primeiro treinamento</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog
        open={successDialog.open}
        onOpenChange={(open) => !open && setSuccessDialog({ open, treinamentoId: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Treinamento Registrado com Sucesso!</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Deseja preencher os dados complementares do treinamento realizado (avaliação, feedback, custos etc.)?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuccessDialog({ open: false, treinamentoId: null })}>
              Preencher depois
            </Button>
            <Button
              onClick={() => {
                const id = successDialog.treinamentoId
                console.log("Navegando para detalhes:", id)
                setSuccessDialog({ open: false, treinamentoId: null })
                if (id) {
                  navigateToDetails(id)
                }
              }}
            >
              Preencher agora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, treinamento: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja excluir o registro de treinamento de{" "}
              <strong>{deleteDialog.treinamento?.funcionario?.nome}</strong>?
            </p>
            <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
              <p>
                <strong>Treinamento:</strong> {deleteDialog.treinamento?.treinamento?.titulo}
              </p>
              <p>
                <strong>Data:</strong>{" "}
                {deleteDialog.treinamento?.dataRealizacao ? formatDate(deleteDialog.treinamento.dataRealizacao) : "-"}
              </p>
              <p>
                <strong>Status:</strong> {deleteDialog.treinamento?.status}
              </p>
            </div>
            <p className="text-sm text-red-600 mt-2">Esta ação não poderá ser desfeita.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, treinamento: null })}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteTreinamento}>
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
