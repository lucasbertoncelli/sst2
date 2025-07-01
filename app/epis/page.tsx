"use client"

import { Plus, FileText, Filter } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { EntregaEPIForm } from "@/components/forms/entrega-epi-form"
import { EstoqueAlertas } from "@/components/estoque-alertas"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ModeloFichaEPI } from "@/components/forms/modelo-ficha-epi"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EntregaEPI {
  id: string
  funcionario: string
  setor: string
  epi: string
  quantidade: number
  dataEntrega: Date
  ca: string
  validade: Date
  fabricacao: Date
}

// Dados de exemplo
const data: EntregaEPI[] = [
  {
    id: "1",
    funcionario: "Maria Santos",
    setor: "Qualidade",
    epi: "Óculos de Proteção",
    quantidade: 1,
    dataEntrega: new Date("2024-01-07"),
    ca: "23456",
    validade: new Date("2024-08-29"),
    fabricacao: new Date("2023-08-29"),
  },
  {
    id: "2",
    funcionario: "João Silva",
    setor: "Produção",
    epi: "Capacete de Segurança",
    quantidade: 1,
    dataEntrega: new Date("2024-01-04"),
    ca: "12345",
    validade: new Date("2025-12-30"),
    fabricacao: new Date("2024-01-14"),
  },
]

export default function EpisPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [entregas, setEntregas] = useState(data)
  const [fichaModalOpen, setFichaModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [currentEntrega, setCurrentEntrega] = useState<EntregaEPI | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [entregaToDelete, setEntregaToDelete] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleAddEntrega = (novaEntrega: EntregaEPI) => {
    setEntregas([...entregas, novaEntrega])
    setModalOpen(false)
  }

  const handleSaveFicha = (fichaData: any) => {
    console.log("Modelo de ficha salvo:", fichaData)
    setFichaModalOpen(false)
    alert("Modelo de ficha salvo com sucesso!")
  }

  const handleEditEntrega = (entrega: EntregaEPI) => {
    setCurrentEntrega(entrega)
    setEditModalOpen(true)
  }

  const handleUpdateEntrega = (updatedEntrega: EntregaEPI) => {
    setEntregas(entregas.map((e) => (e.id === updatedEntrega.id ? updatedEntrega : e)))
    setEditModalOpen(false)
  }

  const confirmDelete = (id: string) => {
    setEntregaToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteEntrega = () => {
    if (entregaToDelete) {
      setEntregas(entregas.filter((e) => e.id !== entregaToDelete))
      setDeleteConfirmOpen(false)
      setEntregaToDelete(null)
    }
  }

  const isVencido = (date: Date) => {
    return new Date() > date
  }

  const filteredEntregas = entregas.filter(
    (entrega) =>
      entrega.funcionario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrega.epi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrega.setor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">EPIs</h1>
          <div className="flex gap-3">
            <Button onClick={() => setFichaModalOpen(true)} variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Modelo de Ficha
            </Button>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Lançar Entrega
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Nova Entrega de EPI</DialogTitle>
                </DialogHeader>
                <EntregaEPIForm onSubmit={handleAddEntrega} onCancel={() => setModalOpen(false)} />
              </DialogContent>
            </Dialog>
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

        <EstoqueAlertas />

        {/* Entregas Recentes */}
        <div className="bg-white rounded-md shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Entregas Recentes ({filteredEntregas.length} registros)
            </h2>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="lg:col-span-1">
              <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os funcionários" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os funcionários</SelectItem>
                  <SelectItem value="maria">Maria Santos</SelectItem>
                  <SelectItem value="joao">João Silva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os setores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os setores</SelectItem>
                  <SelectItem value="producao">Produção</SelectItem>
                  <SelectItem value="qualidade">Qualidade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os EPIs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os EPIs</SelectItem>
                  <SelectItem value="oculos">Óculos de Proteção</SelectItem>
                  <SelectItem value="capacete">Capacete de Segurança</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="valido">Válido</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os períodos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os períodos</SelectItem>
                  <SelectItem value="mes">Último mês</SelectItem>
                  <SelectItem value="trimestre">Último trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>EPI</TableHead>
                  <TableHead>CA</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Fabricação</TableHead>
                  <TableHead>Data Entrega</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntregas.length > 0 ? (
                  filteredEntregas.map((entrega) => (
                    <TableRow key={entrega.id}>
                      <TableCell>{entrega.funcionario}</TableCell>
                      <TableCell>{entrega.setor}</TableCell>
                      <TableCell>{entrega.epi}</TableCell>
                      <TableCell>{entrega.ca}</TableCell>
                      <TableCell>
                        {format(entrega.validade, "dd/MM/yyyy")}
                        {isVencido(entrega.validade) && (
                          <Badge variant="destructive" className="ml-2">
                            Vencido
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{format(entrega.fabricacao, "dd/MM/yyyy")}</TableCell>
                      <TableCell>{format(entrega.dataEntrega, "dd/MM/yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEntrega(entrega)}
                            className="h-8 px-2 text-blue-600"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmDelete(entrega.id)}
                            className="h-8 px-2"
                          >
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      Nenhuma entrega encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Modal de confirmação de exclusão */}
        {deleteConfirmOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Confirmar exclusão</h3>
              <p className="mb-6">Tem certeza que deseja excluir esta entrega de EPI?</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDeleteEntrega}>
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de edição */}
        {editModalOpen && currentEntrega && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Editar Entrega de EPI</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditModalOpen(false)} className="h-8 w-8 p-0">
                  ✕
                </Button>
              </div>
              <EntregaEPIForm
                initialData={currentEntrega}
                onSubmit={handleUpdateEntrega}
                onCancel={() => setEditModalOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
