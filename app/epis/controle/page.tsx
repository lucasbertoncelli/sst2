"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { EPI, Fornecedor } from "@/types"
import {
  Search,
  Package,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Calendar,
  TrendingDown,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"

// Type aliases to avoid generic syntax issues
type StringState = string
type EPIState = EPI | null
type EPIArrayState = EPI[]
type FornecedorArrayState = Fornecedor[]

export default function EPIsControlePage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [epis, setEpis] = useState<EPIArrayState>([])
  const [fornecedores, setFornecedores] = useState<FornecedorArrayState>([])
  const [searchTerm, setSearchTerm] = useState<StringState>("")

  // Estados para Modais e Formulários
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editingEPI, setEditingEPI] = useState<EPIState>(null)
  const [deletingEPI, setDeletingEPI] = useState<EPIState>(null)

  // Estados de formulário
  const [nome, setNome] = useState<StringState>("")
  const [descricao, setDescricao] = useState<StringState>("")
  const [ca, setCa] = useState<StringState>("")
  const [validadeCa, setValidadeCa] = useState<StringState>("")
  const [quantidadeEstoque, setQuantidadeEstoque] = useState(0)
  const [estoqueMinimo, setEstoqueMinimo] = useState(0)
  const [fornecedorId, setFornecedorId] = useState<StringState>("")

  // Estados de feedback
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState<StringState>("")
  const [successMessage, setSuccessMessage] = useState<StringState>("")

  const fetchData = async () => {
    if (!profile?.empresa_id) return
    setLoading(true)

    try {
      const [episRes, fornecedoresRes] = await Promise.allSettled([
        supabase
          .from("epis")
          .select(`
            *,
            fornecedor:fornecedores(*)
          `)
          .eq("empresa_id", profile.empresa_id)
          .order("nome"),
        supabase.from("fornecedores").select("*").eq("empresa_id", profile.empresa_id).order("nome"),
      ])

      if (episRes.status === "fulfilled" && !episRes.value.error) {
        setEpis(episRes.value.data || [])
      } else {
        console.error("Error loading EPIs:", episRes.status === "fulfilled" ? episRes.value.error : episRes.reason)
        setEpis([])
      }

      if (fornecedoresRes.status === "fulfilled" && !fornecedoresRes.value.error) {
        setFornecedores(fornecedoresRes.value.data || [])
      } else {
        console.error(
          "Error loading fornecedores:",
          fornecedoresRes.status === "fulfilled" ? fornecedoresRes.value.error : fornecedoresRes.reason,
        )
        setFornecedores([])
      }
    } catch (error: any) {
      console.error("Unexpected error loading data:", error)
      showError(`Erro inesperado ao carregar dados: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!profile?.empresa_id) return

    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false)
        showError("Tempo limite excedido ao carregar dados. Tente novamente.")
      }
    }, 10000)

    fetchData().finally(() => {
      clearTimeout(timeoutId)
    })

    return () => clearTimeout(timeoutId)
  }, [profile])

  const showError = (message: string) => {
    setErrorMessage(message)
    setShowErrorModal(true)
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const resetForm = () => {
    setNome("")
    setDescricao("")
    setCa("")
    setValidadeCa("")
    setQuantidadeEstoque(0)
    setEstoqueMinimo(0)
    setFornecedorId("")
  }

  const handleAddEPI = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim() || !ca.trim() || !validadeCa) {
      return showError("Preencha todos os campos obrigatórios.")
    }
    if (!profile) return showError("Usuário não autenticado.")

    const { data, error } = await supabase
      .from("epis")
      .insert({
        nome: nome.trim(),
        descricao: descricao.trim() || null,
        ca: ca.trim(),
        validade_ca: validadeCa,
        quantidade_estoque: quantidadeEstoque,
        estoque_minimo: estoqueMinimo,
        fornecedor_id: fornecedorId || null,
        empresa_id: profile.empresa_id,
      })
      .select(`
        *,
        fornecedor:fornecedores(*)
      `)
      .single()

    if (error) return showError(error.message)
    setEpis([...epis, data])
    setShowAddForm(false)
    resetForm()
    showSuccess(`EPI "${data.nome}" cadastrado com sucesso!`)
  }

  const handleEditEPIClick = (epi: EPI) => {
    setEditingEPI(epi)
    setNome(epi.nome)
    setDescricao(epi.descricao || "")
    setCa(epi.ca)
    setValidadeCa(epi.validade_ca)
    setQuantidadeEstoque(epi.quantidade_estoque)
    setEstoqueMinimo(epi.estoque_minimo)
    setFornecedorId(epi.fornecedor_id || "")
    setShowEditForm(true)
  }

  const handleSaveEditEPI = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEPI || !nome.trim() || !ca.trim() || !validadeCa) {
      return showError("Preencha todos os campos obrigatórios.")
    }

    const { data, error } = await supabase
      .from("epis")
      .update({
        nome: nome.trim(),
        descricao: descricao.trim() || null,
        ca: ca.trim(),
        validade_ca: validadeCa,
        quantidade_estoque: quantidadeEstoque,
        estoque_minimo: estoqueMinimo,
        fornecedor_id: fornecedorId || null,
      })
      .eq("id", editingEPI.id)
      .select(`
        *,
        fornecedor:fornecedores(*)
      `)
      .single()

    if (error) return showError(error.message)
    setEpis(epis.map((e) => (e.id === data.id ? data : e)))
    setShowEditForm(false)
    setEditingEPI(null)
    resetForm()
    showSuccess(`EPI "${data.nome}" atualizado com sucesso!`)
  }

  const handleDeleteEPIClick = (epi: EPI) => {
    setDeletingEPI(epi)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteEPI = async () => {
    if (!deletingEPI) return
    const { error } = await supabase.from("epis").delete().eq("id", deletingEPI.id)
    if (error) return showError(error.message)

    setEpis(epis.filter((e) => e.id !== deletingEPI.id))
    setShowDeleteConfirm(false)
    showSuccess(`EPI "${deletingEPI.nome}" excluído com sucesso!`)
    setDeletingEPI(null)
  }

  // Filtros e estatísticas
  const filteredEPIs = epis.filter(
    (epi) =>
      epi.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      epi.ca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (epi.descricao && epi.descricao.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const totalEPIs = epis.length
  const episComEstoqueBaixo = epis.filter((epi) => epi.quantidade_estoque <= epi.estoque_minimo).length
  const episVencidos = epis.filter((epi) => new Date(epi.validade_ca) < new Date()).length
  const episVencendoEm30Dias = epis.filter((epi) => {
    const vencimento = new Date(epi.validade_ca)
    const hoje = new Date()
    const em30Dias = new Date()
    em30Dias.setDate(hoje.getDate() + 30)
    return vencimento >= hoje && vencimento <= em30Dias
  }).length

  const getStatusEstoque = (epi: EPI) => {
    if (epi.quantidade_estoque === 0) return { status: "Sem estoque", color: "destructive" }
    if (epi.quantidade_estoque <= epi.estoque_minimo) return { status: "Estoque baixo", color: "secondary" }
    return { status: "Normal", color: "default" }
  }

  const getStatusCA = (epi: EPI) => {
    const vencimento = new Date(epi.validade_ca)
    const hoje = new Date()
    const em30Dias = new Date()
    em30Dias.setDate(hoje.getDate() + 30)

    if (vencimento < hoje) return { status: "Vencido", color: "destructive" }
    if (vencimento <= em30Dias) return { status: "Vence em breve", color: "secondary" }
    return { status: "Válido", color: "default" }
  }

  const episColumns = [
    { key: "nome", label: "Nome do EPI" },
    { key: "ca", label: "CA" },
    {
      key: "validade_ca",
      label: "Validade CA",
      render: (value: string, row: EPI) => {
        const statusCA = getStatusCA(row)
        return (
          <div className="flex items-center gap-2">
            <span>{new Date(value).toLocaleDateString("pt-BR")}</span>
            <Badge variant={statusCA.color as any}>{statusCA.status}</Badge>
          </div>
        )
      },
    },
    {
      key: "quantidade_estoque",
      label: "Estoque",
      render: (value: number, row: EPI) => {
        const statusEstoque = getStatusEstoque(row)
        return (
          <div className="flex items-center gap-2">
            <span>{value}</span>
            <Badge variant={statusEstoque.color as any}>{statusEstoque.status}</Badge>
          </div>
        )
      },
    },
    { key: "estoque_minimo", label: "Estoque Mínimo" },
    {
      key: "fornecedor",
      label: "Fornecedor",
      render: (value: Fornecedor) => value?.nome || "Não informado",
    },
    {
      key: "actions",
      label: "Ações",
      render: (_: any, row: EPI) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleEditEPIClick(row)}>
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteEPIClick(row)}>
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Carregando dados...</p>
      </div>
    )
  }

  return (
    <div className="w-full px-6 py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controle de EPIs</h1>
          <p className="text-muted-foreground">Gerencie os equipamentos de proteção individual</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo EPI
        </Button>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 animate-in slide-in-from-right">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md">
            <div className="flex items-center justify-center text-orange-500 mb-4">
              <AlertCircle className="h-12 w-12" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-center">Atenção</h2>
            <p className="text-center mb-6 text-gray-700">{errorMessage}</p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => setShowErrorModal(false)}>OK</Button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de EPIs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEPIs}</div>
            <p className="text-xs text-muted-foreground">EPIs cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{episComEstoqueBaixo}</div>
            <p className="text-xs text-muted-foreground">EPIs com estoque baixo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CA Vencidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{episVencidos}</div>
            <p className="text-xs text-muted-foreground">CAs vencidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencem em 30 dias</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{episVencendoEm30Dias}</div>
            <p className="text-xs text-muted-foreground">CAs vencendo</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(episComEstoqueBaixo > 0 || episVencidos > 0 || episVencendoEm30Dias > 0) && (
        <div className="space-y-4 mb-8">
          {episVencidos > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Atenção! Você tem {episVencidos} EPI(s) com CA vencido. Verifique e atualize os certificados.
              </AlertDescription>
            </Alert>
          )}
          {episVencendoEm30Dias > 0 && (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                {episVencendoEm30Dias} EPI(s) terão o CA vencendo nos próximos 30 dias. Planeje a renovação.
              </AlertDescription>
            </Alert>
          )}
          {episComEstoqueBaixo > 0 && (
            <Alert>
              <TrendingDown className="h-4 w-4" />
              <AlertDescription>
                {episComEstoqueBaixo} EPI(s) estão com estoque baixo. Considere fazer novos pedidos.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de EPIs ({filteredEPIs.length} registros)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar EPIs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <DataTable data={filteredEPIs} columns={episColumns} />
        </CardContent>
      </Card>

      {/* Add EPI Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Cadastrar Novo EPI</h2>
            <form onSubmit={handleAddEPI}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do EPI *</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Capacete de Segurança"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descrição detalhada do EPI..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ca">Certificado de Aprovação (CA) *</Label>
                    <Input
                      id="ca"
                      placeholder="Ex: 12345"
                      value={ca}
                      onChange={(e) => setCa(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="validadeCa">Validade do CA *</Label>
                    <Input
                      id="validadeCa"
                      type="date"
                      value={validadeCa}
                      onChange={(e) => setValidadeCa(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantidadeEstoque">Quantidade em Estoque</Label>
                    <Input
                      id="quantidadeEstoque"
                      type="number"
                      min="0"
                      value={quantidadeEstoque}
                      onChange={(e) => setQuantidadeEstoque(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
                    <Input
                      id="estoqueMinimo"
                      type="number"
                      min="0"
                      value={estoqueMinimo}
                      onChange={(e) => setEstoqueMinimo(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="fornecedorId">Fornecedor</Label>
                  <select
                    id="fornecedorId"
                    value={fornecedorId}
                    onChange={(e) => setFornecedorId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um fornecedor</option>
                    {fornecedores.map((fornecedor) => (
                      <option key={fornecedor.id} value={fornecedor.id}>
                        {fornecedor.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Cadastrar EPI</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit EPI Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Editar EPI</h2>
            <form onSubmit={handleSaveEditEPI}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editNome">Nome do EPI *</Label>
                  <Input
                    id="editNome"
                    placeholder="Ex: Capacete de Segurança"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="editDescricao">Descrição</Label>
                  <Textarea
                    id="editDescricao"
                    placeholder="Descrição detalhada do EPI..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editCa">Certificado de Aprovação (CA) *</Label>
                    <Input
                      id="editCa"
                      placeholder="Ex: 12345"
                      value={ca}
                      onChange={(e) => setCa(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editValidadeCa">Validade do CA *</Label>
                    <Input
                      id="editValidadeCa"
                      type="date"
                      value={validadeCa}
                      onChange={(e) => setValidadeCa(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editQuantidadeEstoque">Quantidade em Estoque</Label>
                    <Input
                      id="editQuantidadeEstoque"
                      type="number"
                      min="0"
                      value={quantidadeEstoque}
                      onChange={(e) => setQuantidadeEstoque(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editEstoqueMinimo">Estoque Mínimo</Label>
                    <Input
                      id="editEstoqueMinimo"
                      type="number"
                      min="0"
                      value={estoqueMinimo}
                      onChange={(e) => setEstoqueMinimo(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="editFornecedorId">Fornecedor</Label>
                  <select
                    id="editFornecedorId"
                    value={fornecedorId}
                    onChange={(e) => setFornecedorId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um fornecedor</option>
                    {fornecedores.map((fornecedor) => (
                      <option key={fornecedor.id} value={fornecedor.id}>
                        {fornecedor.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowEditForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <AlertTriangle className="h-12 w-12" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-center">Confirmar Exclusão</h2>
            <p className="text-center mb-6">
              Você está prestes a excluir o EPI <strong>"{deletingEPI?.nome}"</strong>. Esta ação não poderá ser
              desfeita. Deseja continuar?
            </p>
            <div className="flex justify-center gap-4">
              <Button type="button" variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancelar
              </Button>
              <Button type="button" variant="destructive" onClick={confirmDeleteEPI}>
                Sim, Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
