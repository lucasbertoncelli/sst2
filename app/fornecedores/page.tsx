"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Fornecedor, EPI } from "@/types"
import { Search, Truck, Package, FileText, Edit, Trash2, CheckCircle, Plus, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"

export default function FornecedoresPage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [epis, setEpis] = useState<Pick<EPI, "fornecedor_id">[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; fornecedor: Fornecedor | null }>({
    open: false,
    fornecedor: null,
  })
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.empresa_id) return
      setLoading(true)
      try {
        const [fornecedoresRes, episRes] = await Promise.all([
          supabase.from("fornecedores").select("*").eq("empresa_id", profile.empresa_id),
          supabase.from("epis").select("fornecedor_id").eq("empresa_id", profile.empresa_id),
        ])

        if (fornecedoresRes.error) throw fornecedoresRes.error
        if (episRes.error) throw episRes.error

        setFornecedores(fornecedoresRes.data || [])
        setEpis(episRes.data || [])
      } catch (error: any) {
        console.error("Erro ao carregar dados:", error)
        setSuccessMessage(`Erro ao carregar dados: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [profile])

  const filteredFornecedores = fornecedores.filter(
    (fornecedor) =>
      fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.cnpj?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.telefone?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const episPorFornecedor = useMemo(() => {
    return epis.reduce(
      (acc, epi) => {
        if (epi.fornecedor_id) {
          acc[epi.fornecedor_id] = (acc[epi.fornecedor_id] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )
  }, [epis])

  const openDeleteDialog = (fornecedor: Fornecedor) => {
    setDeleteDialog({ open: true, fornecedor })
  }

  const handleDeleteFornecedor = async () => {
    if (!deleteDialog.fornecedor) return

    const fornecedor = deleteDialog.fornecedor
    const episDoFornecedor = episPorFornecedor[fornecedor.id] || 0
    if (episDoFornecedor > 0) {
      alert(`Não é possível excluir. Existem ${episDoFornecedor} EPIs vinculados a este fornecedor.`)
      setDeleteDialog({ open: false, fornecedor: null })
      return
    }

    const { error } = await supabase.from("fornecedores").delete().eq("id", fornecedor.id)

    if (error) {
      alert(`Erro ao excluir fornecedor: ${error.message}`)
    } else {
      setFornecedores(fornecedores.filter((f) => f.id !== fornecedor.id))
      setSuccessMessage(`Fornecedor "${fornecedor.nome}" excluído com sucesso!`)
      setTimeout(() => setSuccessMessage(null), 5000)
    }
    setDeleteDialog({ open: false, fornecedor: null })
  }

  const columns = [
    { key: "nome", label: "Nome do Fornecedor" },
    { key: "cnpj", label: "CNPJ" },
    { key: "telefone", label: "Telefone" },
    {
      key: "epis",
      label: "EPIs Fornecidos",
      render: (_: any, row: Fornecedor) => episPorFornecedor[row.id] || 0,
    },
    {
      key: "actions",
      label: "Ações",
      render: (_: any, row: Fornecedor) => (
        <div className="flex gap-2">
          <Link href={`/fornecedores/editar/${row.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(row)}>
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      ),
    },
  ]

  const totalFornecedores = fornecedores.length
  const fornecedoresComEPIs = Object.keys(episPorFornecedor).length
  const totalEPIsFornecidos = Object.values(episPorFornecedor).reduce((sum, count) => sum + count, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Carregando fornecedores...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cadastro de Fornecedores</h1>
          <p className="text-muted-foreground">Gerencie os fornecedores de EPIs da empresa</p>
        </div>
        <Link href="/fornecedores/cadastro">
          <Button className="bg-black hover:bg-gray-800">
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Fornecedor
          </Button>
        </Link>
      </div>

      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Fornecedores</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFornecedores}</div>
            <p className="text-xs text-muted-foreground">Fornecedores cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fornecedores Ativos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fornecedoresComEPIs}</div>
            <p className="text-xs text-muted-foreground">Com EPIs cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EPIs Fornecidos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEPIsFornecidos}</div>
            <p className="text-xs text-muted-foreground">Tipos de EPIs</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Fornecedores ({filteredFornecedores.length} registros)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar fornecedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <DataTable data={filteredFornecedores} columns={columns} />

          {filteredFornecedores.length === 0 && fornecedores.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhum fornecedor encontrado</p>
              <p className="text-sm">Tente ajustar o termo de busca</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, fornecedor: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja excluir o fornecedor <strong>"{deleteDialog.fornecedor?.nome}"</strong>?
            </p>
            {deleteDialog.fornecedor && (
              <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                <p>
                  <strong>CNPJ:</strong> {deleteDialog.fornecedor.cnpj || "Não informado"}
                </p>
                <p>
                  <strong>Telefone:</strong> {deleteDialog.fornecedor.telefone || "Não informado"}
                </p>
                <p>
                  <strong>EPIs vinculados:</strong> {episPorFornecedor[deleteDialog.fornecedor.id] || 0}
                </p>
              </div>
            )}
            <p className="text-sm text-red-600 mt-2">Esta ação não poderá ser desfeita.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, fornecedor: null })}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteFornecedor}>
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Fornecedor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
