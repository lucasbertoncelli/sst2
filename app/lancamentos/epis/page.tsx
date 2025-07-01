"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EntregaEPIForm } from "@/components/forms/entrega-epi-form"
import { MultiEntregaEPIForm } from "@/components/forms/multi-entrega-epi-form"
import { Plus, Filter, Edit, Trash2, Loader2 } from "lucide-react"
import { format } from "date-fns"
import type { EntregaEPI, Funcionario, EPI } from "@/types"

export default function LancamentosEPIsPage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [entregas, setEntregas] = useState<EntregaEPI[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [epis, setEpis] = useState<EPI[]>([])
  const [editingEntrega, setEditingEntrega] = useState<EntregaEPI | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; entregaId: string | null }>({
    open: false,
    entregaId: null,
  })
  const [showModal, setShowModal] = useState(false)
  const [entregaMode, setEntregaMode] = useState<"unica" | "multipla">("unica")
  const [searchTerm, setSearchTerm] = useState("")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fetchData = useCallback(async (empresaId: string) => {
    setLoading(true)
    try {
      const { data: entregasData, error: entregasError } = await supabase
        .from("entrega_epis")
        .select("*, funcionarios(*, setores(*)), epis(*)")
        .eq("empresa_id", empresaId)
        .order("data_entrega", { ascending: false })

      if (entregasError) throw entregasError

      const { data: funcionariosData, error: funcionariosError } = await supabase
        .from("funcionarios")
        .select("*")
        .eq("empresa_id", empresaId)
      if (funcionariosError) throw funcionariosError

      const { data: episData, error: episError } = await supabase.from("epis").select("*").eq("empresa_id", empresaId)
      if (episError) throw episError

      setEntregas(entregasData as any)
      setFuncionarios(funcionariosData)
      setEpis(episData)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      setErrorMessage("Falha ao carregar os dados. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (profile?.empresa_id) {
      fetchData(profile.empresa_id)
    }
  }, [profile, fetchData])

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const showError = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 3000)
  }

  const handleEntregaSubmit = async (data: any) => {
    if (!profile) return showError("Perfil não encontrado.")
    try {
      const payload = { ...data, empresa_id: profile.empresa_id }
      const { error } = await supabase.from("entrega_epis").insert(payload)
      if (error) throw error
      showSuccess("Entrega de EPI registrada com sucesso!")
      setShowModal(false)
      fetchData(profile.empresa_id)
    } catch (error) {
      console.error("Erro ao registrar entrega:", error)
      showError("Falha ao registrar entrega.")
    }
  }

  const handleUpdateSubmit = async (data: any) => {
    if (!editingEntrega) return
    try {
      const { error } = await supabase.from("entrega_epis").update(data).eq("id", editingEntrega.id)
      if (error) throw error
      showSuccess("Entrega atualizada com sucesso!")
      setShowModal(false)
      setEditingEntrega(null)
      fetchData(profile!.empresa_id)
    } catch (error) {
      console.error("Erro ao atualizar entrega:", error)
      showError("Falha ao atualizar entrega.")
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.entregaId || !profile) return
    try {
      const { error } = await supabase.from("entrega_epis").delete().eq("id", deleteDialog.entregaId)
      if (error) throw error
      showSuccess("Entrega excluída com sucesso!")
      setDeleteDialog({ open: false, entregaId: null })
      fetchData(profile.empresa_id)
    } catch (error) {
      console.error("Erro ao excluir entrega:", error)
      showError("Falha ao excluir entrega.")
    }
  }

  const handleEdit = (entrega: EntregaEPI) => {
    setEditingEntrega(entrega)
    setEntregaMode("unica")
    setShowModal(true)
  }

  const filteredEntregas = entregas.filter(
    (entrega) =>
      entrega.funcionario?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrega.epi?.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Entrega de EPIs</h1>
        <p className="text-muted-foreground">Registre e gerencie a entrega de EPIs aos funcionários.</p>
      </div>

      {successMessage && <div className="bg-green-100 text-green-800 p-3 rounded-md">{successMessage}</div>}
      {errorMessage && <div className="bg-red-100 text-red-800 p-3 rounded-md">{errorMessage}</div>}

      <div className="flex justify-start gap-2">
        <Button
          onClick={() => {
            setEditingEntrega(null)
            setShowModal(true)
          }}
          className="bg-primary hover:bg-primary/90"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Lançar Entrega
        </Button>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingEntrega ? "Editar Entrega de EPI" : "Nova Entrega de EPI"}</DialogTitle>
          </DialogHeader>
          {!editingEntrega && (
            <div className="flex gap-2 border-b pb-4">
              <Button variant={entregaMode === "unica" ? "default" : "outline"} onClick={() => setEntregaMode("unica")}>
                Entrega Única
              </Button>
              <Button
                variant={entregaMode === "multipla" ? "default" : "outline"}
                onClick={() => setEntregaMode("multipla")}
              >
                Entrega Múltipla
              </Button>
            </div>
          )}
          {entregaMode === "unica" ? (
            <EntregaEPIForm
              onSubmit={editingEntrega ? handleUpdateSubmit : handleEntregaSubmit}
              onCancel={() => {
                setShowModal(false)
                setEditingEntrega(null)
              }}
              initialData={editingEntrega}
              funcionarios={funcionarios}
              epis={epis}
            />
          ) : (
            <MultiEntregaEPIForm
              onSubmit={() => {
                /* Implementar lógica de submissão múltipla */
              }}
              onCancel={() => setShowModal(false)}
              funcionarios={funcionarios}
              epis={epis}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-md shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Entregas Recentes ({filteredEntregas.length})
          </h2>
          <Input
            placeholder="Buscar por funcionário ou EPI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>EPI</TableHead>
                <TableHead>CA</TableHead>
                <TableHead>Data Entrega</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntregas.length > 0 ? (
                filteredEntregas.map((entrega) => (
                  <TableRow key={entrega.id}>
                    <TableCell>{entrega.funcionario?.nome}</TableCell>
                    <TableCell>{(entrega.funcionario as any)?.setores?.nome || "N/A"}</TableCell>
                    <TableCell>{entrega.epi?.nome}</TableCell>
                    <TableCell>{entrega.epi?.ca}</TableCell>
                    <TableCell>{format(new Date(entrega.data_entrega), "dd/MM/yyyy")}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(entrega)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteDialog({ open: true, entregaId: entrega.id })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Nenhuma entrega encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, entregaId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir esta entrega? O EPI será retornado ao estoque.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, entregaId: null })}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
