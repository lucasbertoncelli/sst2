"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/data-table"
import { Modal } from "@/components/modal"
import { EntregaEPIForm } from "@/components/forms/entrega-epi-form"
import { ModeloFichaEPI } from "@/components/forms/modelo-ficha-epi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { mockEntregasEPI, mockEstoqueEPI, mockFuncionarios, mockEPIs } from "@/lib/mock-data"
import { StockManager } from "@/lib/stock-manager"
import type { EntregaEPI } from "@/types"
import { Plus, Package, AlertTriangle, FileText } from "lucide-react"

export default function LancamentosPage() {
  const [entregas, setEntregas] = useState(mockEntregasEPI)
  const [estoque, setEstoque] = useState(mockEstoqueEPI)
  const [modalOpen, setModalOpen] = useState(false)
  const [fichaModalOpen, setFichaModalOpen] = useState(false)

  const stockManager = StockManager.getInstance()

  useEffect(() => {
    // Initialize stock manager with current data
    stockManager.setEstoqueData(estoque)
    stockManager.setEntregaData(entregas)
  }, [estoque, entregas])

  const columns = [
    { key: "funcionario.nome", label: "Funcionário" },
    { key: "funcionario.setor", label: "Setor" },
    { key: "epi.nome", label: "EPI" },
    { key: "epi.ca", label: "CA" },
    {
      key: "dataEntrega",
      label: "Data Entrega",
      render: (value: Date) => (value ? new Date(value).toLocaleDateString("pt-BR") : "-"),
    },
    {
      key: "status",
      label: "Status",
      render: (value: any, row: EntregaEPI) => {
        const epiValidade = row.epi?.validade
        if (epiValidade) {
          const today = new Date()
          const validade = new Date(epiValidade)
          const isExpired = validade < today
          const isExpiringSoon = (validade.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 30

          if (isExpired) {
            return <Badge variant="destructive">EPI Vencido</Badge>
          } else if (isExpiringSoon) {
            return <Badge variant="secondary">Vence em breve</Badge>
          }
        }
        return <Badge variant="default">Ativo</Badge>
      },
    },
  ]

  const handleAddEntrega = (formData: Partial<EntregaEPI>) => {
    const funcionario = mockFuncionarios.find((f) => f.id === formData.funcionarioId)
    const epi = mockEPIs.find((e) => e.id === formData.epiId)

    const newEntrega: EntregaEPI = {
      id: Date.now().toString(),
      funcionarioId: formData.funcionarioId!,
      epiId: formData.epiId!,
      dataEntrega: formData.dataEntrega!,
      funcionario,
      epi,
    }

    // Add new delivery
    setEntregas([...entregas, newEntrega])

    // Update stock using the hook system
    const updatedEstoque = stockManager.afterCreateEntregaEPI(newEntrega)
    setEstoque(updatedEstoque)

    setModalOpen(false)
  }

  const handleSaveFicha = (fichaData: any) => {
    console.log("Modelo de ficha salvo:", fichaData)
    // Aqui você salvaria o modelo de ficha
    setFichaModalOpen(false)
    alert("Modelo de ficha salvo com sucesso!")
  }

  // Get low stock items
  const lowStockItems = estoque.filter((item) => item.quantidade <= 5)
  const outOfStockItems = estoque.filter((item) => item.quantidade === 0)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lançamentos de EPI</h1>
          <p className="text-muted-foreground">Registre entregas de EPIs aos funcionários</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setFichaModalOpen(true)} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Modelo de Ficha
          </Button>
          <Modal
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Lançar Entrega
              </Button>
            }
            title="Nova Entrega de EPI"
            open={modalOpen}
            onOpenChange={setModalOpen}
          >
            <EntregaEPIForm onSubmit={handleAddEntrega} onCancel={() => setModalOpen(false)} />
          </Modal>
        </div>
      </div>

      {/* Modal para Modelo de Ficha */}
      {fichaModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Modelo de Ficha de Controle de EPI</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFichaModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              <ModeloFichaEPI onSave={handleSaveFicha} onCancel={() => setFichaModalOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Stock Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="space-y-4">
          {outOfStockItems.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>EPIs sem estoque:</strong> {outOfStockItems.map((item) => item.epi?.nome).join(", ")}
              </AlertDescription>
            </Alert>
          )}
          {lowStockItems.length > 0 && (
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription>
                <strong>EPIs com estoque baixo:</strong>{" "}
                {lowStockItems
                  .filter((item) => item.quantidade > 0)
                  .map((item) => `${item.epi?.nome} (${item.quantidade})`)
                  .join(", ")}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Stock Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Entregas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entregas.length}</div>
            <p className="text-xs text-muted-foreground">EPIs entregues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Itens com estoque ≤ 5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Estoque</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Itens esgotados</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Entregas ({entregas.length} registros)</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={entregas} columns={columns} />
        </CardContent>
      </Card>
    </div>
  )
}
