"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { DataTable } from "@/components/data-table"
import { AcidenteForm } from "@/components/forms/acidente-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Acidente, Funcionario } from "@/types"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export default function LancamentosAcidentesPage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [acidentes, setAcidentes] = useState<Acidente[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAcidente, setEditingAcidente] = useState<Acidente | null>(null)
  const [deletingAcidente, setDeletingAcidente] = useState<Acidente | null>(null)

  const fetchData = useCallback(async (empresaId: string) => {
    setLoading(true)
    try {
      const { data: acidentesData, error: acidentesError } = await supabase
        .from("acidentes")
        .select("*, funcionarios(*)")
        .eq("empresa_id", empresaId)
      if (acidentesError) throw acidentesError
      setAcidentes(acidentesData as any)

      const { data: funcData, error: funcError } = await supabase
        .from("funcionarios")
        .select("*")
        .eq("empresa_id", empresaId)
      if (funcError) throw funcError
      setFuncionarios(funcData)
    } catch (error) {
      console.error("Erro ao buscar dados de acidentes:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (profile?.empresa_id) {
      fetchData(profile.empresa_id)
    }
  }, [profile, fetchData])

  const handleSubmit = async (formData: any) => {
    if (!profile) return
    const payload = { ...formData, empresa_id: profile.empresa_id }

    try {
      if (editingAcidente) {
        await supabase.from("acidentes").update(payload).eq("id", editingAcidente.id)
      } else {
        await supabase.from("acidentes").insert(payload)
      }
      setModalOpen(false)
      setEditingAcidente(null)
      fetchData(profile.empresa_id)
    } catch (error) {
      console.error("Erro ao salvar acidente:", error)
    }
  }

  const handleDelete = async () => {
    if (!deletingAcidente || !profile) return
    try {
      await supabase.from("acidentes").delete().eq("id", deletingAcidente.id)
      setDeletingAcidente(null)
      fetchData(profile.empresa_id)
    } catch (error) {
      console.error("Erro ao excluir acidente:", error)
    }
  }

  const handleEdit = (item: Acidente) => {
    setEditingAcidente(item)
    setModalOpen(true)
  }

  const columns = [
    { key: "funcionario.nome", label: "Funcionário" },
    { key: "tipo_acidente", label: "Tipo" },
    {
      key: "data_acidente",
      label: "Data",
      render: (value: string) => (value ? format(new Date(value), "dd/MM/yyyy") : "-"),
    },
    {
      key: "gravidade",
      label: "Gravidade",
      render: (value: string) => (
        <Badge
          variant={value === "Leve" ? "secondary" : value === "Moderada" ? "default" : "destructive"}
          className="capitalize"
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "dias_afastamento",
      label: "Afastamento",
      render: (value: number) => (value ? `${value} dias` : "N/A"),
    },
    {
      key: "actions",
      label: "Ações",
      render: (_: any, row: Acidente) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)} className="h-8 w-8 p-0">
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeletingAcidente(row)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Acidentes de Trabalho</h1>
          <p className="text-muted-foreground">Registre e gerencie os acidentes de trabalho.</p>
        </div>
        <Button
          onClick={() => {
            setEditingAcidente(null)
            setModalOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Registrar Acidente
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingAcidente ? "Editar Acidente" : "Novo Acidente de Trabalho"}</DialogTitle>
          </DialogHeader>
          <AcidenteForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setModalOpen(false)
              setEditingAcidente(null)
            }}
            initialData={editingAcidente}
            funcionarios={funcionarios}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingAcidente} onOpenChange={() => setDeletingAcidente(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir este registro de acidente?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle>Registros de Acidentes ({acidentes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={acidentes} columns={columns} />
        </CardContent>
      </Card>
    </div>
  )
}
