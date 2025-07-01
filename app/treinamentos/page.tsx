"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, AlertTriangle, Loader2 } from "lucide-react"

import { TreinamentoResponsavelForm } from "@/components/forms/treinamento-responsavel-form"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import type { Treinamento, Funcionario } from "@/types"

export default function TreinamentosPage() {
  const { profile } = useAuth()
  const [treinamentos, setTreinamentos] = useState<Treinamento[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTreinamento, setEditingTreinamento] = useState<Treinamento | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; treinamento: Treinamento | null }>({
    open: false,
    treinamento: null,
  })
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [successDialog, setSuccessDialog] = useState<{ open: boolean; treinamentoId: string | null }>({
    open: false,
    treinamentoId: null,
  })

  const fetchData = useCallback(async () => {
    if (!profile?.empresa_id) return

    setLoading(true)
    setError(null)

    try {
      const { data: treinamentosData, error: treinamentosError } = await supabase
        .from("treinamentos")
        .select("*")
        .eq("empresa_id", profile.empresa_id)
        .order("data_realizacao", { ascending: false })

      if (treinamentosError) throw treinamentosError

      const { data: funcionariosData, error: funcionariosError } = await supabase
        .from("funcionarios")
        .select("*")
        .eq("empresa_id", profile.empresa_id)

      if (funcionariosError) throw funcionariosError

      setTreinamentos(treinamentosData || [])
      setFuncionarios(funcionariosData || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [profile?.empresa_id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const handleAddTreinamento = async (formData: Partial<Treinamento>) => {
    if (!profile?.empresa_id) {
      setError("Perfil da empresa não encontrado.")
      return
    }

    const { responsavel, ...restOfData } = formData
    const dataToUpsert = {
      ...restOfData,
      empresa_id: profile.empresa_id,
      responsavel_tipo: responsavel?.tipo,
      responsavel_funcionario_id: responsavel?.tipo === "funcionario" ? responsavel.funcionarioId : null,
      responsavel_terceirizado_nome: responsavel?.tipo === "terceirizado" ? responsavel.nomeResponsavel : null,
      responsavel_terceirizado_empresa: responsavel?.tipo === "terceirizado" ? responsavel.empresaResponsavel : null,
    }

    if (editingTreinamento) {
      // Update
      const { error: updateError } = await supabase
        .from("treinamentos")
        .update(dataToUpsert)
        .eq("id", editingTreinamento.id)
      if (updateError) {
        setError(updateError.message)
      } else {
        showSuccessMessage("Treinamento atualizado com sucesso!")
      }
    } else {
      // Insert
      const { data: newTreinamento, error: insertError } = await supabase
        .from("treinamentos")
        .insert(dataToUpsert)
        .select()
        .single()

      if (insertError) {
        setError(insertError.message)
      } else {
        setSuccessDialog({ open: true, treinamentoId: newTreinamento.id })
      }
    }

    setModalOpen(false)
    setEditingTreinamento(null)
    fetchData() // Refresh data
  }

  const handleEditTreinamento = (treinamento: Treinamento) => {
    setEditingTreinamento(treinamento)
    setModalOpen(true)
  }

  const handleDeleteTreinamento = async () => {
    if (deleteDialog.treinamento) {
      const { error: deleteError } = await supabase.from("treinamentos").delete().eq("id", deleteDialog.treinamento.id)

      if (deleteError) {
        setError(deleteError.message)
      } else {
        showSuccessMessage("Treinamento excluído com sucesso!")
      }
      setDeleteDialog({ open: false, treinamento: null })
      fetchData() // Refresh data
    }
  }

  const formatDate = (date: Date | string): string => {
    if (!date) return "-"
    try {
      return new Date(date).toLocaleDateString("pt-BR", { timeZone: "UTC" })
    } catch (error) {
      return "-"
    }
  }

  const columns = [
    { key: "titulo", label: "Título" },
    { key: "tipo", label: "Tipo" },
    {
      key: "data_realizacao",
      label: "Data Realização",
      render: (value: Date) => formatDate(value),
    },
    {
      key: "validade",
      label: "Validade",
      render: (value: Date) => formatDate(value),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant={value === "concluido" ? "default" : value === "pendente" ? "secondary" : "destructive"}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: "responsavel",
      label: "Responsável",
      render: (_: any, row: Treinamento) => {
        if (row.responsavel_tipo === "funcionario") {
          const funcionario = funcionarios.find((f) => f.id === row.responsavel_funcionario_id)
          return funcionario ? `${funcionario.nome} (Interno)` : "Funcionário não encontrado"
        } else if (row.responsavel_tipo === "terceirizado") {
          return `${row.responsavel_terceirizado_nome} (${row.responsavel_terceirizado_empresa})`
        }
        return "-"
      },
    },
    {
      key: "actions",
      label: "Ações",
      render: (_: any, row: Treinamento) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleEditTreinamento(row)}>
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteDialog({ open: true, treinamento: row })}>
            <Trash2 className="w-4 h-4 mr-1" />
            Excluir
          </Button>
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Treinamentos</h1>
          <p className="text-muted-foreground">Gerencie os treinamentos dos funcionários</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Treinamento
        </Button>
      </div>

      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Treinamentos ({treinamentos.length} registros)</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={treinamentos} columns={columns} />
        </CardContent>
      </Card>

      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) setEditingTreinamento(null)
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTreinamento ? "Editar Treinamento" : "Novo Treinamento"}</DialogTitle>
          </DialogHeader>
          <TreinamentoResponsavelForm
            onSubmit={handleAddTreinamento}
            onCancel={() => {
              setModalOpen(false)
              setEditingTreinamento(null)
            }}
            initialData={editingTreinamento || undefined}
            funcionarios={funcionarios}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, treinamento: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja excluir o treinamento <strong>{deleteDialog.treinamento?.titulo}</strong>?
            </p>
            <p className="text-sm text-red-600 mt-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Esta ação não poderá ser desfeita.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, treinamento: null })}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteTreinamento}>
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Treinamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={successDialog.open} onOpenChange={(open) => setSuccessDialog({ open, treinamentoId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Treinamento Registrado com Sucesso!</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Deseja preencher os dados complementares (custo, local, duração, satisfação etc.)?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuccessDialog({ open: false, treinamentoId: null })}>
              Preencher depois
            </Button>
            <Button
              onClick={() => {
                window.location.href = `/treinamentos/detalhes/${successDialog.treinamentoId}`
              }}
            >
              Preencher agora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
