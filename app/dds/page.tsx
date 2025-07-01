"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { DataTable } from "@/components/data-table"
import { DDSForm } from "@/components/forms/dds-form"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { DDS, Funcionario } from "@/types"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { format } from "date-fns"

export default function DDSPage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DDS[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDDS, setEditingDDS] = useState<DDS | null>(null)

  const fetchData = useCallback(async (empresaId: string) => {
    setLoading(true)
    try {
      const { data: ddsData, error: ddsError } = await supabase
        .from("dds")
        .select("*, dds_participantes(funcionarios(*))")
        .eq("empresa_id", empresaId)
      if (ddsError) throw ddsError

      const formattedDDS = ddsData.map((d: any) => ({
        ...d,
        participantes: d.dds_participantes.map((p: any) => p.funcionarios),
      }))
      setData(formattedDDS)

      const { data: funcData, error: funcError } = await supabase
        .from("funcionarios")
        .select("*")
        .eq("empresa_id", empresaId)
      if (funcError) throw funcError
      setFuncionarios(funcData)
    } catch (error) {
      console.error("Erro ao buscar dados de DDS:", error)
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
    const { participantesIds, ...ddsData } = formData
    ddsData.empresa_id = profile.empresa_id

    try {
      if (editingDDS) {
        // Update
        const { data: updatedDDS, error: updateError } = await supabase
          .from("dds")
          .update(ddsData)
          .eq("id", editingDDS.id)
          .select()
          .single()
        if (updateError) throw updateError

        await supabase.from("dds_participantes").delete().eq("dds_id", updatedDDS.id)
        const participantesData = participantesIds.map((funcId: string) => ({
          dds_id: updatedDDS.id,
          funcionario_id: funcId,
          empresa_id: profile.empresa_id,
        }))
        await supabase.from("dds_participantes").insert(participantesData)
      } else {
        // Create
        const { data: newDDS, error: createError } = await supabase.from("dds").insert(ddsData).select().single()
        if (createError) throw createError

        const participantesData = participantesIds.map((funcId: string) => ({
          dds_id: newDDS.id,
          funcionario_id: funcId,
          empresa_id: profile.empresa_id,
        }))
        await supabase.from("dds_participantes").insert(participantesData)
      }

      setModalOpen(false)
      setEditingDDS(null)
      fetchData(profile.empresa_id)
    } catch (error) {
      console.error("Erro ao salvar DDS:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!profile) return
    try {
      // ON DELETE CASCADE should handle participants
      await supabase.from("dds").delete().eq("id", id)
      fetchData(profile.empresa_id)
    } catch (error) {
      console.error("Erro ao excluir DDS:", error)
    }
  }

  const handleEdit = (dds: DDS) => {
    setEditingDDS(dds)
    setModalOpen(true)
  }

  const columns = [
    { key: "tema", label: "Tema" },
    {
      key: "data",
      label: "Data",
      render: (value: string) => (value ? format(new Date(value), "dd/MM/yyyy") : "-"),
    },
    { key: "responsavel", label: "Responsável" },
    {
      key: "participantes",
      label: "Participantes",
      render: (value: any[]) => value?.length || 0,
    },
    {
      key: "actions",
      label: "Ações",
      render: (_: any, row: DDS) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)} className="h-8 w-8 p-0">
            <Edit className="h-3 w-3" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-800">
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                <AlertDialogDescription>Tem certeza que deseja excluir o DDS "{row.tema}"?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(row.id)} className="bg-red-600 hover:bg-red-700">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
          <h1 className="text-3xl font-bold tracking-tight">Diálogo Diário de Segurança</h1>
          <p className="text-muted-foreground">Registre e acompanhe os DDS realizados</p>
        </div>
        <Button
          onClick={() => {
            setEditingDDS(null)
            setModalOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Registrar DDS
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDDS ? "Editar DDS" : "Novo DDS"}</DialogTitle>
          </DialogHeader>
          <DDSForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setModalOpen(false)
              setEditingDDS(null)
            }}
            initialData={editingDDS}
            funcionarios={funcionarios}
          />
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>DDS Realizados ({data.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={data} columns={columns} />
        </CardContent>
      </Card>
    </div>
  )
}
