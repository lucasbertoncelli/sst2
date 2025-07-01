"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { Setor, Turno, Funcionario } from "@/types"
import {
  Search,
  Building,
  UserCheck,
  Trash2,
  Edit,
  Plus,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"

const diasSemanaOptions = [
  { id: "Segunda", label: "Segunda-feira" },
  { id: "Terça", label: "Terça-feira" },
  { id: "Quarta", label: "Quarta-feira" },
  { id: "Quinta", label: "Quinta-feira" },
  { id: "Sexta", label: "Sexta-feira" },
  { id: "Sábado", label: "Sábado" },
  { id: "Domingo", label: "Domingo" },
]

export default function SetoresPage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [setores, setSetores] = useState<Setor[]>([])
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [funcionarios, setFuncionarios] = useState<Pick<Funcionario, "setor_id" | "turno_id">[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchTermTurnos, setSearchTermTurnos] = useState("")

  // Estados para Modais e Formulários
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editingSetor, setEditingSetor] = useState<Setor | null>(null)
  const [deletingSetor, setDeletingSetor] = useState<Setor | null>(null)

  const [showAddTurnoForm, setShowAddTurnoForm] = useState(false)
  const [showEditTurnoForm, setShowEditTurnoForm] = useState(false)
  const [showDeleteTurnoConfirm, setShowDeleteTurnoConfirm] = useState(false)
  const [editingTurno, setEditingTurno] = useState<Turno | null>(null)
  const [deletingTurno, setDeletingTurno] = useState<Turno | null>(null)

  // Estados de formulário
  const [nomeSetor, setNomeSetor] = useState("")
  const [nomeTurno, setNomeTurno] = useState("")
  const [horaInicio, setHoraInicio] = useState("")
  const [horaFim, setHoraFim] = useState("")
  const [diasSemana, setDiasSemana] = useState<string[]>([])
  const [intervalo, setIntervalo] = useState("")
  const [cargaHorariaDiaria, setCargaHorariaDiaria] = useState<number>(8)
  const [observacoesTurno, setObservacoesTurno] = useState("")

  // Estados de feedback
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const fetchData = async () => {
    if (!profile?.empresa_id) return
    setLoading(true)

    try {
      // Execute queries in parallel for better performance
      const [setoresRes, turnosRes, funcionariosRes] = await Promise.allSettled([
        supabase.from("setores").select("*").eq("empresa_id", profile.empresa_id).order("nome"),
        supabase.from("turnos").select("*").eq("empresa_id", profile.empresa_id).order("nome"),
        supabase.from("funcionarios").select("setor_id, turno_id").eq("empresa_id", profile.empresa_id),
      ])

      // Handle setores result
      if (setoresRes.status === "fulfilled" && !setoresRes.value.error) {
        setSetores(setoresRes.value.data || [])
      } else {
        console.error(
          "Error loading setores:",
          setoresRes.status === "fulfilled" ? setoresRes.value.error : setoresRes.reason,
        )
        setSetores([])
      }

      // Handle turnos result
      if (turnosRes.status === "fulfilled" && !turnosRes.value.error) {
        setTurnos(turnosRes.value.data || [])
      } else {
        console.error(
          "Error loading turnos:",
          turnosRes.status === "fulfilled" ? turnosRes.value.error : turnosRes.reason,
        )
        setTurnos([])
      }

      // Handle funcionarios result
      if (funcionariosRes.status === "fulfilled" && !funcionariosRes.value.error) {
        setFuncionarios(funcionariosRes.value.data || [])
      } else {
        console.error(
          "Error loading funcionarios:",
          funcionariosRes.status === "fulfilled" ? funcionariosRes.value.error : funcionariosRes.reason,
        )
        setFuncionarios([])
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

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false)
        showError("Tempo limite excedido ao carregar dados. Tente novamente.")
      }
    }, 10000) // 10 second timeout

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

  // Contagens
  const funcionariosPorSetor = useMemo(() => {
    return funcionarios.reduce(
      (acc, func) => {
        if (func.setor_id) {
          acc[func.setor_id] = (acc[func.setor_id] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )
  }, [funcionarios])

  const funcionariosPorTurno = useMemo(() => {
    return funcionarios.reduce(
      (acc, func) => {
        if (func.turno_id) {
          acc[func.turno_id] = (acc[func.turno_id] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )
  }, [funcionarios])

  // Funções de CRUD para Setores
  const handleAddSetor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nomeSetor.trim()) return showError("O nome do setor é obrigatório.")
    if (!profile) return showError("Usuário não autenticado.")

    const { data, error } = await supabase
      .from("setores")
      .insert({ nome: nomeSetor.trim(), empresa_id: profile.empresa_id })
      .select()
      .single()

    if (error) return showError(error.message)
    setSetores([...setores, data])
    setShowAddForm(false)
    setNomeSetor("")
    showSuccess(`Setor "${data.nome}" cadastrado com sucesso!`)
  }

  const handleEditSetorClick = (setor: Setor) => {
    setEditingSetor(setor)
    setNomeSetor(setor.nome)
    setShowEditForm(true)
  }

  const handleSaveEditSetor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSetor || !nomeSetor.trim()) return showError("Dados inválidos.")

    const { data, error } = await supabase
      .from("setores")
      .update({ nome: nomeSetor.trim() })
      .eq("id", editingSetor.id)
      .select()
      .single()

    if (error) return showError(error.message)
    setSetores(setores.map((s) => (s.id === data.id ? data : s)))
    setShowEditForm(false)
    setEditingSetor(null)
    showSuccess(`Setor "${data.nome}" atualizado com sucesso!`)
  }

  const handleDeleteSetorClick = (setor: Setor) => {
    if ((funcionariosPorSetor[setor.id] || 0) > 0) {
      return showError(`Não é possível excluir. Existem ${funcionariosPorSetor[setor.id]} funcionários neste setor.`)
    }
    setDeletingSetor(setor)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteSetor = async () => {
    if (!deletingSetor) return
    const { error } = await supabase.from("setores").delete().eq("id", deletingSetor.id)
    if (error) return showError(error.message)

    setSetores(setores.filter((s) => s.id !== deletingSetor.id))
    setShowDeleteConfirm(false)
    showSuccess(`Setor "${deletingSetor.nome}" excluído com sucesso!`)
    setDeletingSetor(null)
  }

  // Funções de CRUD para Turnos
  const resetTurnoForm = () => {
    setNomeTurno("")
    setHoraInicio("")
    setHoraFim("")
    setDiasSemana([])
    setIntervalo("")
    setCargaHorariaDiaria(8)
    setObservacoesTurno("")
  }

  const handleAddTurno = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nomeTurno.trim() || !horaInicio || !horaFim || diasSemana.length === 0) {
      return showError("Preencha todos os campos obrigatórios do turno.")
    }
    if (!profile) return showError("Usuário não autenticado.")

    const { data, error } = await supabase
      .from("turnos")
      .insert({
        nome: nomeTurno.trim(),
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        dias_semana: diasSemana,
        intervalo,
        carga_horaria_diaria: cargaHorariaDiaria,
        observacoes: observacoesTurno,
        empresa_id: profile.empresa_id,
      })
      .select()
      .single()

    if (error) return showError(error.message)
    setTurnos([...turnos, data])
    setShowAddTurnoForm(false)
    resetTurnoForm()
    showSuccess(`Turno "${data.nome}" cadastrado com sucesso!`)
  }

  const handleEditTurnoClick = (turno: Turno) => {
    setEditingTurno(turno)
    setNomeTurno(turno.nome)
    setHoraInicio(turno.hora_inicio)
    setHoraFim(turno.hora_fim)
    setDiasSemana(turno.dias_semana)
    setIntervalo(turno.intervalo || "")
    setCargaHorariaDiaria(turno.carga_horaria_diaria)
    setObservacoesTurno(turno.observacoes || "")
    setShowEditTurnoForm(true)
  }

  const handleSaveEditTurno = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTurno) return showError("Nenhum turno selecionado para edição.")

    const { data, error } = await supabase
      .from("turnos")
      .update({
        nome: nomeTurno.trim(),
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        dias_semana: diasSemana,
        intervalo,
        carga_horaria_diaria: cargaHorariaDiaria,
        observacoes: observacoesTurno,
      })
      .eq("id", editingTurno.id)
      .select()
      .single()

    if (error) return showError(error.message)
    setTurnos(turnos.map((t) => (t.id === data.id ? data : t)))
    setShowEditTurnoForm(false)
    setEditingTurno(null)
    resetTurnoForm()
    showSuccess(`Turno "${data.nome}" atualizado com sucesso!`)
  }

  const handleDeleteTurnoClick = (turno: Turno) => {
    if ((funcionariosPorTurno[turno.id] || 0) > 0) {
      return showError(`Não é possível excluir. Existem ${funcionariosPorTurno[turno.id]} funcionários neste turno.`)
    }
    setDeletingTurno(turno)
    setShowDeleteTurnoConfirm(true)
  }

  const confirmDeleteTurno = async () => {
    if (!deletingTurno) return
    const { error } = await supabase.from("turnos").delete().eq("id", deletingTurno.id)
    if (error) return showError(error.message)

    setTurnos(turnos.filter((t) => t.id !== deletingTurno.id))
    setShowDeleteTurnoConfirm(false)
    showSuccess(`Turno "${deletingTurno.nome}" excluído com sucesso!`)
    setDeletingTurno(null)
  }

  const handleDiasSemanaChange = (dia: string, checked: boolean) => {
    setDiasSemana((prev) => (checked ? [...prev, dia] : prev.filter((d) => d !== dia)))
  }

  // Filtros
  const filteredSetores = setores.filter((setor) => setor.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  const filteredTurnos = turnos.filter(
    (turno) =>
      turno.nome.toLowerCase().includes(searchTermTurnos.toLowerCase()) ||
      turno.hora_inicio.includes(searchTermTurnos) ||
      turno.hora_fim.includes(searchTermTurnos),
  )

  // Colunas
  const setoresColumns = [
    { key: "nome", label: "Nome do Setor" },
    {
      key: "funcionarios",
      label: "Funcionários",
      render: (_: any, row: Setor) => funcionariosPorSetor[row.id] || 0,
    },
    {
      key: "actions",
      label: "Ações",
      render: (_: any, row: Setor) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleEditSetorClick(row)}>
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteSetorClick(row)}>
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      ),
    },
  ]

  const turnosColumns = [
    { key: "nome", label: "Nome do Turno" },
    { key: "hora_inicio", label: "Hora Início" },
    { key: "hora_fim", label: "Hora Fim" },
    {
      key: "dias_semana",
      label: "Dias da Semana",
      render: (value: string[]) => value.join(", "),
    },
    { key: "carga_horaria_diaria", label: "Carga Horária", render: (value: number) => `${value}h` },
    {
      key: "funcionarios",
      label: "Funcionários",
      render: (_: any, row: Turno) => funcionariosPorTurno[row.id] || 0,
    },
    {
      key: "actions",
      label: "Ações",
      render: (_: any, row: Turno) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleEditTurnoClick(row)}>
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteTurnoClick(row)}>
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      ),
    },
  ]

  // Estatísticas
  const totalSetores = setores.length
  const totalTurnos = turnos.length
  const totalFuncionarios = funcionarios.length
  const setoresSemFuncionarios = setores.filter((setor) => !funcionariosPorSetor[setor.id]).length
  const turnosSemFuncionarios = turnos.filter((turno) => !funcionariosPorTurno[turno.id]).length

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
          <h1 className="text-3xl font-bold tracking-tight">Setores e Turnos</h1>
          <p className="text-muted-foreground">Gerencie os setores e turnos da empresa</p>
        </div>
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
            <CardTitle className="text-sm font-medium">Total de Setores</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSetores}</div>
            <p className="text-xs text-muted-foreground">Setores cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Turnos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTurnos}</div>
            <p className="text-xs text-muted-foreground">Turnos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFuncionarios}</div>
            <p className="text-xs text-muted-foreground">Total de funcionários</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Vinculação</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{setoresSemFuncionarios + turnosSemFuncionarios}</div>
            <p className="text-xs text-muted-foreground">Setores/turnos vazios</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Setores and Turnos */}
      <Tabs defaultValue="setores" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="setores">Setores</TabsTrigger>
          <TabsTrigger value="turnos">Turnos</TabsTrigger>
        </TabsList>

        {/* Setores Tab */}
        <TabsContent value="setores" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Setor
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Setores ({filteredSetores.length} registros)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar setores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <DataTable data={filteredSetores} columns={setoresColumns} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Turnos Tab */}
        <TabsContent value="turnos" className="space-y-6">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                resetTurnoForm()
                setShowAddTurnoForm(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Turno
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Turnos ({filteredTurnos.length} registros)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar turnos..."
                  value={searchTermTurnos}
                  onChange={(e) => setSearchTermTurnos(e.target.value)}
                  className="pl-8"
                />
              </div>

              <DataTable data={filteredTurnos} columns={turnosColumns} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Setor Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Cadastrar Novo Setor</h2>
            <form onSubmit={handleAddSetor}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Setor *</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Produção"
                    value={nomeSetor}
                    onChange={(e) => setNomeSetor(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Cadastrar Setor</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Setor Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Editar Setor</h2>
            <form onSubmit={handleSaveEditSetor}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editNome">Nome do Setor *</Label>
                  <Input
                    id="editNome"
                    placeholder="Ex: Produção"
                    value={nomeSetor}
                    onChange={(e) => setNomeSetor(e.target.value)}
                    required
                  />
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

      {/* Add Turno Form Modal */}
      {showAddTurnoForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Cadastrar Novo Turno</h2>
            <form onSubmit={handleAddTurno}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nomeTurno">Nome do Turno *</Label>
                  <Input
                    id="nomeTurno"
                    placeholder="Ex: Manhã"
                    value={nomeTurno}
                    onChange={(e) => setNomeTurno(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="horaInicio">Hora Início *</Label>
                    <Input
                      id="horaInicio"
                      type="time"
                      value={horaInicio}
                      onChange={(e) => setHoraInicio(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="horaFim">Hora Fim *</Label>
                    <Input
                      id="horaFim"
                      type="time"
                      value={horaFim}
                      onChange={(e) => setHoraFim(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Dias da Semana *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {diasSemanaOptions.map((dia) => (
                      <div key={dia.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={dia.id}
                          checked={diasSemana.includes(dia.id)}
                          onCheckedChange={(checked) => handleDiasSemanaChange(dia.id, checked as boolean)}
                        />
                        <Label htmlFor={dia.id} className="text-sm">
                          {dia.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="cargaHorariaDiaria">Carga Horária Diária (horas) *</Label>
                  <Input
                    id="cargaHorariaDiaria"
                    type="number"
                    min="1"
                    max="24"
                    step="0.5"
                    value={cargaHorariaDiaria}
                    onChange={(e) => setCargaHorariaDiaria(Number(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="intervalo">Intervalos</Label>
                  <Input
                    id="intervalo"
                    placeholder="Ex: 09:00-09:15, 12:00-13:00"
                    value={intervalo}
                    onChange={(e) => setIntervalo(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="observacoesTurno">Observações</Label>
                  <Textarea
                    id="observacoesTurno"
                    placeholder="Observações sobre o turno..."
                    value={observacoesTurno}
                    onChange={(e) => setObservacoesTurno(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowAddTurnoForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Cadastrar Turno</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Turno Form Modal */}
      {showEditTurnoForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Editar Turno</h2>
            <form onSubmit={handleSaveEditTurno}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editNomeTurno">Nome do Turno *</Label>
                  <Input
                    id="editNomeTurno"
                    placeholder="Ex: Manhã"
                    value={nomeTurno}
                    onChange={(e) => setNomeTurno(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editHoraInicio">Hora Início *</Label>
                    <Input
                      id="editHoraInicio"
                      type="time"
                      value={horaInicio}
                      onChange={(e) => setHoraInicio(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editHoraFim">Hora Fim *</Label>
                    <Input
                      id="editHoraFim"
                      type="time"
                      value={horaFim}
                      onChange={(e) => setHoraFim(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Dias da Semana *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {diasSemanaOptions.map((dia) => (
                      <div key={dia.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-${dia.id}`}
                          checked={diasSemana.includes(dia.id)}
                          onCheckedChange={(checked) => handleDiasSemanaChange(dia.id, checked as boolean)}
                        />
                        <Label htmlFor={`edit-${dia.id}`} className="text-sm">
                          {dia.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="editCargaHorariaDiaria">Carga Horária Diária (horas) *</Label>
                  <Input
                    id="editCargaHorariaDiaria"
                    type="number"
                    min="1"
                    max="24"
                    step="0.5"
                    value={cargaHorariaDiaria}
                    onChange={(e) => setCargaHorariaDiaria(Number(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="editIntervalo">Intervalos</Label>
                  <Input
                    id="editIntervalo"
                    placeholder="Ex: 09:00-09:15, 12:00-13:00"
                    value={intervalo}
                    onChange={(e) => setIntervalo(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="editObservacoesTurno">Observações</Label>
                  <Textarea
                    id="editObservacoesTurno"
                    placeholder="Observações sobre o turno..."
                    value={observacoesTurno}
                    onChange={(e) => setObservacoesTurno(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowEditTurnoForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modals */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <AlertTriangle className="h-12 w-12" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-center">Confirmar Exclusão</h2>
            <p className="text-center mb-6">
              Você está prestes a excluir o setor <strong>"{deletingSetor?.nome}"</strong>. Esta ação não poderá ser
              desfeita. Deseja continuar?
            </p>
            <div className="flex justify-center gap-4">
              <Button type="button" variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancelar
              </Button>
              <Button type="button" variant="destructive" onClick={confirmDeleteSetor}>
                Sim, Excluir
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDeleteTurnoConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <AlertTriangle className="h-12 w-12" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-center">Confirmar Exclusão</h2>
            <p className="text-center mb-6">
              Você está prestes a excluir o turno <strong>"{deletingTurno?.nome}"</strong>. Esta ação não poderá ser
              desfeita. Deseja continuar?
            </p>
            <div className="flex justify-center gap-4">
              <Button type="button" variant="outline" onClick={() => setShowDeleteTurnoConfirm(false)}>
                Cancelar
              </Button>
              <Button type="button" variant="destructive" onClick={confirmDeleteTurno}>
                Sim, Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
