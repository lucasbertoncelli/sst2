"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { mockFuncionarios, mockSetores } from "@/lib/mock-data"
import { useFilters } from "@/hooks/use-filters"
import type { Funcionario } from "@/types"
import { Search, Users, Building, Briefcase } from "lucide-react"

export default function FuncionariosPage() {
  const router = useRouter()
  const [funcionarios, setFuncionarios] = useState(mockFuncionarios)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentFuncionario, setCurrentFuncionario] = useState<Funcionario | null>(null)

  const filterConfig = {
    nome: (item: Funcionario, value: string) => item.nome.toLowerCase().includes(value.toLowerCase()),
    setor: (item: Funcionario, value: string) => item.setor.toLowerCase() === value.toLowerCase(),
    cargo: (item: Funcionario, value: string) => item.cargo?.toLowerCase().includes(value.toLowerCase()) || false,
  }

  const { filteredData, filters, updateFilter } = useFilters(funcionarios, filterConfig)

  // Apply search filter
  const searchFilteredData = filteredData.filter(
    (funcionario) =>
      funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.setor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.cargo?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const columns = [
    { key: "nome", label: "Nome" },
    {
      key: "setor",
      label: "Setor",
      render: (value: string) => (
        <Badge variant="outline" className="font-medium">
          {value}
        </Badge>
      ),
    },
    { key: "cargo", label: "Cargo" },
    {
      key: "actions",
      label: "Ações",
      render: (value: any, row: Funcionario) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleEditFuncionario(row)}>
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteFuncionario(row)}>
            Excluir
          </Button>
        </div>
      ),
    },
  ]

  const handleEditFuncionario = (funcionario: Funcionario) => {
    // Redirecionar para a página de edição completa
    router.push(`/funcionarios/editar/${funcionario.id}`)
  }

  const handleDeleteFuncionario = (funcionario: Funcionario) => {
    setCurrentFuncionario(funcionario)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (currentFuncionario) {
      setFuncionarios(funcionarios.filter((f) => f.id !== currentFuncionario.id))
      setIsDeleteModalOpen(false)
      setCurrentFuncionario(null)
    }
  }

  // Get statistics
  const totalFuncionarios = funcionarios.length
  const setoresUnicos = [...new Set(funcionarios.map((f) => f.setor))].length
  const funcionariosComCargo = funcionarios.filter((f) => f.cargo).length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
          <p className="text-muted-foreground">Gerencie o cadastro de funcionários da empresa</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFuncionarios}</div>
            <p className="text-xs text-muted-foreground">Funcionários cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Setores</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{setoresUnicos}</div>
            <p className="text-xs text-muted-foreground">Setores diferentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Cargo Definido</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{funcionariosComCargo}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((funcionariosComCargo / totalFuncionarios) * 100)}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Funcionários ({searchFilteredData.length} registros)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar funcionários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Select value={filters.setor || "todos"} onValueChange={(value) => updateFilter("setor", value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os setores</SelectItem>
                {mockSetores.map((setor) => (
                  <SelectItem key={setor.id} value={setor.nome}>
                    {setor.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchTerm || filters.setor) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  updateFilter("setor", "todos")
                }}
              >
                Limpar Filtros
              </Button>
            )}
          </div>

          <DataTable data={searchFilteredData} columns={columns} />
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Tem certeza que deseja excluir o funcionário <strong>{currentFuncionario?.nome}</strong>?
            </p>
            <p className="text-sm text-muted-foreground">Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Excluir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
