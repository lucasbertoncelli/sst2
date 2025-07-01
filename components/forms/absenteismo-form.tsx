"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Absenteismo, Funcionario } from "@/types"
import { format } from "date-fns"

interface AbsenteismoFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: Absenteismo | null
  funcionarios: Funcionario[]
}

export function AbsenteismoForm({ onSubmit, onCancel, initialData, funcionarios }: AbsenteismoFormProps) {
  const [formData, setFormData] = useState({
    funcionario_id: initialData?.funcionario_id || "",
    tipo: initialData?.tipo || "",
    cid: initialData?.cid || "",
    data_inicio: initialData?.data_inicio ? format(new Date(initialData.data_inicio), "yyyy-MM-dd") : "",
    data_fim: initialData?.data_fim ? format(new Date(initialData.data_fim), "yyyy-MM-dd") : "",
    horas_perdidas: initialData?.horas_perdidas || "",
    motivo: initialData?.motivo || "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        funcionario_id: initialData.funcionario_id || "",
        tipo: initialData.tipo || "",
        cid: initialData.cid || "",
        data_inicio: initialData.data_inicio ? format(new Date(initialData.data_inicio), "yyyy-MM-dd") : "",
        data_fim: initialData.data_fim ? format(new Date(initialData.data_fim), "yyyy-MM-dd") : "",
        horas_perdidas: initialData.horas_perdidas?.toString() || "",
        motivo: initialData.motivo || "",
      })
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      horas_perdidas: formData.horas_perdidas ? Number(formData.horas_perdidas) : null,
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="funcionario">Funcionário</Label>
        <Select
          value={formData.funcionario_id}
          onValueChange={(value) => setFormData({ ...formData, funcionario_id: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um funcionário" />
          </SelectTrigger>
          <SelectContent>
            {funcionarios.map((funcionario) => (
              <SelectItem key={funcionario.id} value={funcionario.id}>
                {funcionario.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo de Ausência</Label>
        <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Atestado Médico">Atestado Médico</SelectItem>
            <SelectItem value="Falta Justificada">Falta Justificada</SelectItem>
            <SelectItem value="Falta Injustificada">Falta Injustificada</SelectItem>
            <SelectItem value="Licença">Licença</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.tipo === "Atestado Médico" && (
        <div className="space-y-2">
          <Label htmlFor="cid">CID (Código Internacional de Doenças)</Label>
          <Input
            id="cid"
            type="text"
            placeholder="Ex: M54.5"
            value={formData.cid}
            onChange={(e) => setFormData({ ...formData, cid: e.target.value })}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dataInicio">Data Início</Label>
          <Input
            id="dataInicio"
            type="date"
            value={formData.data_inicio}
            onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dataFim">Data Fim</Label>
          <Input
            id="dataFim"
            type="date"
            value={formData.data_fim}
            onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="horasPerdidas">Horas Perdidas</Label>
        <Input
          id="horasPerdidas"
          type="number"
          min="0"
          step="0.5"
          placeholder="Ex: 8.0"
          value={formData.horas_perdidas}
          onChange={(e) => setFormData({ ...formData, horas_perdidas: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivo">Motivo / Justificativa</Label>
        <Textarea
          id="motivo"
          placeholder="Descreva o motivo da ausência"
          value={formData.motivo}
          onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
        />
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
