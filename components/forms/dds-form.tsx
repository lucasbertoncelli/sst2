"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { DDS, Funcionario } from "@/types"
import { format } from "date-fns"

interface DDSFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: DDS | null
  funcionarios: Funcionario[]
}

export function DDSForm({ onSubmit, onCancel, initialData, funcionarios }: DDSFormProps) {
  const [formData, setFormData] = useState({
    tema: initialData?.tema || "",
    responsavel: initialData?.responsavel || "",
    data: initialData?.data ? format(new Date(initialData.data), "yyyy-MM-dd") : "",
    participantesIds: initialData?.participantes?.map((p) => p.id) || [],
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        tema: initialData.tema || "",
        responsavel: initialData.responsavel || "",
        data: initialData.data ? format(new Date(initialData.data), "yyyy-MM-dd") : "",
        participantesIds: initialData.participantes?.map((p) => p.id) || [],
      })
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const toggleParticipante = (funcionarioId: string) => {
    setFormData((prev) => ({
      ...prev,
      participantesIds: prev.participantesIds.includes(funcionarioId)
        ? prev.participantesIds.filter((id) => id !== funcionarioId)
        : [...prev.participantesIds, funcionarioId],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tema">Tema</Label>
        <Input
          id="tema"
          placeholder="Tema do DDS"
          value={formData.tema}
          onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsavel">Responsável</Label>
        <Input
          id="responsavel"
          placeholder="Nome do responsável"
          value={formData.responsavel}
          onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="data">Data</Label>
        <Input
          id="data"
          type="date"
          value={formData.data}
          onChange={(e) => setFormData({ ...formData, data: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Participantes</Label>
        <div className="max-h-48 overflow-y-auto space-y-2 border rounded p-2">
          {funcionarios.map((funcionario) => (
            <div key={funcionario.id} className="flex items-center space-x-2">
              <Checkbox
                id={`func-${funcionario.id}`}
                checked={formData.participantesIds.includes(funcionario.id)}
                onCheckedChange={() => toggleParticipante(funcionario.id)}
              />
              <Label htmlFor={`func-${funcionario.id}`} className="text-sm font-normal">
                {funcionario.nome}
              </Label>
            </div>
          ))}
        </div>
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
