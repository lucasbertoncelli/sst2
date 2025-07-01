"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { DataTable } from "@/components/data-table"
import { AbsenteismoForm } from "@/components/forms/absenteismo-form"
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
import type { Absenteismo, Funcionario } from "@/types"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { format } from "date-fns"

export default function AbsenteismoPage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Absenteismo[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAbsenteismo, setEditingAbsenteismo] = useState<Absenteismo | null>(null)
  const [deletingAbsenteismo, setDeletingAbsenteismo] = useState<Absenteismo | null>(null)

  const fetchData = useCallback(async (empresaId: string) => {
    setLoading(true)
    try {
      const { data: absenteismoData, error: absenteismoError } = await supabase
        .from("absenteismo")
        .select("*, funcionarios(*)")
        .eq("empresa_id", empresaId)
      if (absenteismoError) throw absenteismoError
      setData(absenteismoData as any)

      const { data: funcData, error: funcError } = await supabase
        .from("funcionarios")
        .select("*")
        .eq("empresa_id", empresaId)
      if (funcError) throw funcError
      setFuncionarios(funcData)
    } catch (error) {
      console.error("Erro ao buscar dados de absenteísmo:", error)
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
      if (editingAbsenteismo) {
        await supabase.from("absenteismo").update(payload).eq("id", editingAbsenteismo.id)
      } else {
        await supabase.from("absenteismo").insert(payload)
      }
      setModalOpen(false)
      setEditingAbsenteismo(null)
      fetchData(profile.empresa_id)
    } catch (error) {
      console.error("Erro ao salvar registro de absenteísmo:", error)
    }
  }

  const handleDelete = async () => {
    if (!deletingAbsenteismo || !profile) return
    try {
      await supabase.from("absenteismo").delete().eq("id", deletingAbsenteismo.id)
      setDeletingAbsenteismo(null)
      fetchData(profile.empresa_id)
    } catch (error) {
      console.error("Erro ao excluir registro:", error)
    }
  }

  const handleEdit = (item: Absenteismo) => {
    setEditingAbsenteismo(item)
    setModalOpen(true)
  }

  const columns = [
    { key: "funcionario.nome", label: "Funcionário" },
    { key: "tipo", label: "Tipo" },
    {
      key: "data_inicio",
      label: "Data Início",
      render: (value: string) => (value ? format(new Date(value), "dd/MM/yyyy") : "-"),
    },
    {
      key: "data_fim",
      label: "Data Fim",
      render: (value: string) => (value ? format(new Date(value), "dd/MM/yyyy") : "-"),
    },
    {
      key: "horas_perdidas",
      label: "Horas Perdidas",
      render: (value: number) => (value ? `${value}h` : "-"),
    },
    {
      key: "actions",
      label: "Ações",
      render: (_: any, row: Absenteismo) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)} className="h-8 w-8 p-0">
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeletingAbsenteismo(row)}
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
          <h1 className="text-3xl font-bold tracking-tight">Absenteísmo</h1>
          <p className="text-muted-foreground">Controle de faltas e ausências dos funcionários</p>
        </div>
        <Button
          onClick={() => {
            setEditingAbsenteismo(null)
            setModalOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Ausência
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAbsenteismo ? "Editar Ausência" : "Nova Ausência"}</DialogTitle>
          </DialogHeader>
          <AbsenteismoForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setModalOpen(false)
              setEditingAbsenteismo(null)
            }}
            initialData={editingAbsenteismo}
            funcionarios={funcionarios}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingAbsenteismo} onOpenChange={() => setDeletingAbsenteismo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir este registro de ausência?</AlertDialogDescription>
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
          <CardTitle>Registro de Ausências ({data.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={data} columns={columns} />
        </CardContent>
      </Card>
    </div>
  )
}
