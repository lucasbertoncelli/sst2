"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { EntregaEPI, Funcionario, EPI } from "@/types"
import { AlertTriangle } from "lucide-react"
import { format } from "date-fns"

interface EntregaEPIFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: EntregaEPI | null
  funcionarios: Funcionario[]
  epis: EPI[]
}

export function EntregaEPIForm({ onSubmit, onCancel, initialData, funcionarios, epis }: EntregaEPIFormProps) {
  const [formData, setFormData] = useState({
    funcionario_id: initialData?.funcionario_id || "",
    epi_id: initialData?.epi_id || "",
    data_entrega: initialData?.data_entrega ? format(new Date(initialData.data_entrega), "yyyy-MM-dd") : "",
    quantidade: initialData?.quantidade || 1,
  })
  const [stockWarning, setStockWarning] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        funcionario_id: initialData.funcionario_id || "",
        epi_id: initialData.epi_id || "",
        data_entrega: initialData.data_entrega ? format(new Date(initialData.data_entrega), "yyyy-MM-dd") : "",
        quantidade: initialData.quantidade || 1,
      })
    }
  }, [initialData])

  const handleEPIChange = (epiId: string) => {
    setFormData({ ...formData, epi_id: epiId })
    const selectedEpi = epis.find((e) => e.id === epiId)
    if (!selectedEpi) return

    const availableQuantity = selectedEpi.quantidade_estoque
    if (availableQuantity === 0) {
      setStockWarning("Este EPI não possui estoque disponível!")
    } else if (availableQuantity <= (selectedEpi.estoque_minimo || 5)) {
      setStockWarning(`Atenção: Apenas ${availableQuantity} unidades em estoque!`)
    } else {
      setStockWarning(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedEpi = epis.find((e) => e.id === formData.epi_id)
    if (!initialData && selectedEpi && selectedEpi.quantidade_estoque < formData.quantidade) {
      setStockWarning("Quantidade solicitada maior que o estoque disponível!")
      return
    }
    onSubmit(formData)
  }

  const isSubmitDisabled = !initialData && !epis.find((e) => e.id === formData.epi_id)?.quantidade_estoque

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
        <Label htmlFor="epi">EPI</Label>
        <Select value={formData.epi_id} onValueChange={handleEPIChange} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um EPI" />
          </SelectTrigger>
          <SelectContent>
            {epis.map((epi) => (
              <SelectItem key={epi.id} value={epi.id} disabled={epi.quantidade_estoque === 0 && !initialData}>
                {epi.nome} - CA: {epi.ca} ({epi.quantidade_estoque} disponível)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {stockWarning && (
        <Alert variant={stockWarning.includes("não possui") ? "destructive" : "default"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{stockWarning}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantidade">Quantidade</Label>
          <Input
            id="quantidade"
            type="number"
            min="1"
            value={formData.quantidade}
            onChange={(e) => setFormData({ ...formData, quantidade: Number.parseInt(e.target.value, 10) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dataEntrega">Data de Entrega</Label>
          <Input
            id="dataEntrega"
            type="date"
            value={formData.data_entrega}
            onChange={(e) => setFormData({ ...formData, data_entrega: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1" disabled={isSubmitDisabled}>
          {initialData ? "Salvar Alterações" : "Lançar EPI"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  )
}
