"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { Acidente, Funcionario } from "@/types"
import { format } from "date-fns"

interface AcidenteFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: Acidente | null
  funcionarios: Funcionario[]
}

export function AcidenteForm({ onSubmit, onCancel, initialData, funcionarios }: AcidenteFormProps) {
  const [formData, setFormData] = useState({
    funcionario_id: initialData?.funcionario_id || "",
    data_acidente: initialData?.data_acidente ? format(new Date(initialData.data_acidente), "yyyy-MM-dd") : "",
    tipo_acidente: initialData?.tipo_acidente || "",
    local_acidente: initialData?.local_acidente || "",
    descricao: initialData?.descricao || "",
    houve_cat: initialData?.houve_cat || false,
    cat_numero: initialData?.cat_numero || "",
    dias_afastamento: initialData?.dias_afastamento || 0,
    gravidade: initialData?.gravidade || "Leve",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        funcionario_id: initialData.funcionario_id || "",
        data_acidente: initialData.data_acidente ? format(new Date(initialData.data_acidente), "yyyy-MM-dd") : "",
        tipo_acidente: initialData.tipo_acidente || "",
        local_acidente: initialData.local_acidente || "",
        descricao: initialData.descricao || "",
        houve_cat: initialData.houve_cat || false,
        cat_numero: initialData.cat_numero || "",
        dias_afastamento: initialData.dias_afastamento || 0,
        gravidade: initialData.gravidade || "Leve",
      })
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      dias_afastamento: Number(formData.dias_afastamento),
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Label htmlFor="data_acidente">Data do Acidente</Label>
          <Input
            id="data_acidente"
            type="date"
            value={formData.data_acidente}
            onChange={(e) => setFormData({ ...formData, data_acidente: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tipo_acidente">Tipo do Acidente</Label>
          <Input
            id="tipo_acidente"
            placeholder="Ex: Corte, Queda, Contusão"
            value={formData.tipo_acidente}
            onChange={(e) => setFormData({ ...formData, tipo_acidente: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="local_acidente">Local do Acidente</Label>
          <Input
            id="local_acidente"
            placeholder="Ex: Linha de Produção 2"
            value={formData.local_acidente}
            onChange={(e) => setFormData({ ...formData, local_acidente: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição do Acidente</Label>
        <Textarea
          id="descricao"
          placeholder="Descreva como o acidente ocorreu"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gravidade">Gravidade</Label>
          <Select
            value={formData.gravidade}
            onValueChange={(value) => setFormData({ ...formData, gravidade: value as any })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a gravidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Leve">Leve</SelectItem>
              <SelectItem value="Moderada">Moderada</SelectItem>
              <SelectItem value="Grave">Grave</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dias_afastamento">Dias de Afastamento</Label>
          <Input
            id="dias_afastamento"
            type="number"
            min="0"
            value={formData.dias_afastamento}
            onChange={(e) => setFormData({ ...formData, dias_afastamento: e.target.value as any })}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="houve_cat"
          checked={formData.houve_cat}
          onCheckedChange={(checked) => setFormData({ ...formData, houve_cat: !!checked })}
        />
        <Label htmlFor="houve_cat">Houve emissão de CAT?</Label>
      </div>

      {formData.houve_cat && (
        <div className="space-y-2">
          <Label htmlFor="cat_numero">Número da CAT</Label>
          <Input
            id="cat_numero"
            placeholder="Número do Comunicado de Acidente de Trabalho"
            value={formData.cat_numero}
            onChange={(e) => setFormData({ ...formData, cat_numero: e.target.value })}
          />
        </div>
      )}

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
