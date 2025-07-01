"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import { DataForm } from "@/components/data-form"
import { Modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockUsuarios } from "@/lib/mock-data"
import type { Usuario } from "@/types"
import { Plus } from "lucide-react"

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState(mockUsuarios)
  const [modalOpen, setModalOpen] = useState(false)

  const columns = [
    { key: "email", label: "E-mail" },
    {
      key: "role",
      label: "Perfil",
      render: (value: string) => {
        const roleLabels = {
          admin: "Administrador",
          rh: "RH",
          sst: "SST",
          viewer: "Visualizador",
        }
        const roleColors = {
          admin: "destructive",
          rh: "default",
          sst: "secondary",
          viewer: "outline",
        }
        return (
          <Badge variant={roleColors[value as keyof typeof roleColors] as any}>
            {roleLabels[value as keyof typeof roleLabels]}
          </Badge>
        )
      },
    },
  ]

  const handleAddUsuario = (userData: Partial<Usuario>) => {
    const newUsuario: Usuario = {
      id: Date.now().toString(),
      email: userData.email!,
      senha: userData.senha!,
      role: userData.role as Usuario["role"],
    }

    setUsuarios([...usuarios, newUsuario])
    setModalOpen(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
        </div>
        <Modal
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          }
          title="Novo Usuário"
          open={modalOpen}
          onOpenChange={setModalOpen}
        >
          <DataForm
            model="usuario"
            fields={["email", "senha", "role"]}
            submitLabel="Criar Usuário"
            onSubmit={handleAddUsuario}
          />
        </Modal>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários ({usuarios.length} registros)</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={usuarios} columns={columns} />
        </CardContent>
      </Card>
    </div>
  )
}
