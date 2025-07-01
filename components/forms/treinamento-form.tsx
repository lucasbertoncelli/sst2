"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockFuncionarios, mockTreinamentos } from "@/lib/mock-data"
import type { RelTreinamentosFuncionario } from "@/types"

interface TreinamentoFormProps {
  onSubmit: (data: Partial<RelTreinamentosFuncionario>) => void
  onCancel: () => void
}

export function TreinamentoForm({ onSubmit, onCancel }: TreinamentoFormProps) {
  const [formData, setFormData] = useState({
    funcionarioId: "",
    treinamentoId: "",
    dataRealizacao: "",
    status: "pendente" as const,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      dataRealizacao: new Date(formData.dataRealizacao),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="funcionario">Funcionário</Label>
        <Select
          value={formData.funcionarioId}
          onValueChange={(value) => setFormData({ ...formData, funcionarioId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um funcionário" />
          </SelectTrigger>
          <SelectContent>
            {mockFuncionarios.map((funcionario) => (
              <SelectItem key={funcionario.id} value={funcionario.id}>
                {funcionario.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="treinamento">Treinamento</Label>
        <Select
          value={formData.treinamentoId}
          onValueChange={(value) => setFormData({ ...formData, treinamentoId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um treinamento" />
          </SelectTrigger>
          <SelectContent>
            {mockTreinamentos.map((treinamento) => (
              <SelectItem key={treinamento.id} value={treinamento.id}>
                {treinamento.titulo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dataRealizacao">Data de Realização</Label>
        <Input
          id="dataRealizacao"
          type="date"
          value={formData.dataRealizacao}
          onChange={(e) => setFormData({ ...formData, dataRealizacao: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: "pendente" | "concluido") => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Salvar
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  )
}
