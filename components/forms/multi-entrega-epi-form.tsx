"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockFuncionarios, mockEPIs } from "@/lib/mock-data"
import { StockManager } from "@/lib/stock-manager"
import type { EntregaEPI } from "@/types"
import { AlertTriangle, Plus, Trash2, Info } from "lucide-react"

interface MultiEntregaEPIFormProps {
  onSubmit: (data: Partial<EntregaEPI>[]) => void
  onCancel: () => void
}

interface EpiSelecionado {
  epiId: string
  ca: string
  validade: string
  dataFabricacao?: string
}

export function MultiEntregaEPIForm({ onSubmit, onCancel }: MultiEntregaEPIFormProps) {
  const [funcionarioId, setFuncionarioId] = useState("")
  const [dataEntrega, setDataEntrega] = useState("")
  const [episSelecionados, setEpisSelecionados] = useState<EpiSelecionado[]>([])
  const [stockWarning, setStockWarning] = useState<string | null>(null)

  const stockManager = StockManager.getInstance()

  // Adicionar um EPI vazio à lista
  const adicionarEpi = () => {
    setEpisSelecionados([...episSelecionados, { epiId: "", ca: "", validade: "", dataFabricacao: "" }])
  }

  // Remover um EPI da lista
  const removerEpi = (index: number) => {
    const novosEpis = [...episSelecionados]
    novosEpis.splice(index, 1)
    setEpisSelecionados(novosEpis)
  }

  // Atualizar um campo de um EPI específico
  const atualizarEpi = (index: number, campo: keyof EpiSelecionado, valor: string) => {
    const novosEpis = [...episSelecionados]
    novosEpis[index] = { ...novosEpis[index], [campo]: valor }

    // Se o campo for epiId, verificar estoque
    if (campo === "epiId") {
      const epiId = valor
      const availableQuantity = stockManager.getAvailableQuantity(epiId)

      if (availableQuantity === 0) {
        setStockWarning(`O EPI selecionado não possui estoque disponível!`)
      } else if (availableQuantity <= 5) {
        setStockWarning(`Atenção: Apenas ${availableQuantity} unidades em estoque para um dos EPIs selecionados!`)
      } else {
        setStockWarning(null)
      }
    }

    setEpisSelecionados(novosEpis)
  }

  // Verificar se todos os EPIs têm estoque disponível
  const verificarEstoque = (): boolean => {
    for (const epi of episSelecionados) {
      if (!stockManager.isEPIAvailable(epi.epiId)) {
        setStockWarning(`Não é possível entregar o EPI selecionado. Estoque insuficiente!`)
        return false
      }
    }
    return true
  }

  // Verificar se o formulário está válido
  const isFormValid = (): boolean => {
    if (!funcionarioId || !dataEntrega || episSelecionados.length === 0) {
      return false
    }

    // Verificar se todos os EPIs têm os campos obrigatórios preenchidos
    return episSelecionados.every((epi) => epi.epiId && epi.ca && epi.validade)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!verificarEstoque()) {
      return
    }

    // Criar um array de entregas
    const entregas = episSelecionados.map((epi) => ({
      funcionarioId,
      epiId: epi.epiId,
      ca: epi.ca,
      validade: new Date(epi.validade),
      dataFabricacao: epi.dataFabricacao ? new Date(epi.dataFabricacao) : undefined,
      dataEntrega: new Date(dataEntrega),
    }))

    onSubmit(entregas)
  }

  // Adicionar um EPI inicial se a lista estiver vazia
  useEffect(() => {
    if (episSelecionados.length === 0) {
      adicionarEpi()
    }
  }, [episSelecionados.length])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="funcionario">Funcionário</Label>
          <Select value={funcionarioId} onValueChange={setFuncionarioId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um funcionário" />
            </SelectTrigger>
            <SelectContent>
              {mockFuncionarios.map((funcionario) => (
                <SelectItem key={funcionario.id} value={funcionario.id}>
                  {funcionario.nome} - {funcionario.setor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataEntrega">Data de Entrega</Label>
          <Input
            id="dataEntrega"
            type="date"
            value={dataEntrega}
            onChange={(e) => setDataEntrega(e.target.value)}
            required
          />
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">EPIs a entregar</h3>
            <Button type="button" onClick={adicionarEpi} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" /> Adicionar EPI
            </Button>
          </div>

          {stockWarning && (
            <Alert variant="warning" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{stockWarning}</AlertDescription>
            </Alert>
          )}

          {episSelecionados.length === 0 ? (
            <div className="text-center py-8 border rounded-md border-dashed">
              <p className="text-muted-foreground">Nenhum EPI selecionado</p>
              <Button type="button" onClick={adicionarEpi} variant="outline" className="mt-2">
                <Plus className="w-4 h-4 mr-1" /> Adicionar EPI
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {episSelecionados.map((epi, index) => (
                <Card key={index} className="relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removerEpi(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">EPI #{index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`epi-${index}`}>EPI</Label>
                      <Select value={epi.epiId} onValueChange={(value) => atualizarEpi(index, "epiId", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um EPI" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockEPIs.map((epiOption) => {
                            const quantity = stockManager.getAvailableQuantity(epiOption.id)
                            return (
                              <SelectItem key={epiOption.id} value={epiOption.id} disabled={quantity === 0}>
                                {epiOption.nome} ({quantity} disponível)
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`ca-${index}`}>CA (Certificado de Aprovação)</Label>
                      <Input
                        id={`ca-${index}`}
                        placeholder="Ex: 12345"
                        value={epi.ca}
                        onChange={(e) => atualizarEpi(index, "ca", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`validade-${index}`}>Data de Validade</Label>
                        <Input
                          id={`validade-${index}`}
                          type="date"
                          value={epi.validade}
                          onChange={(e) => atualizarEpi(index, "validade", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`fabricacao-${index}`}>Data de Fabricação</Label>
                        <Input
                          id={`fabricacao-${index}`}
                          type="date"
                          value={epi.dataFabricacao}
                          onChange={(e) => atualizarEpi(index, "dataFabricacao", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {episSelecionados.length > 0 && (
        <Alert variant="info" className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-600">
            Você está prestes a entregar {episSelecionados.length} EPI{episSelecionados.length > 1 ? "s" : ""} para o
            funcionário selecionado.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1" disabled={!isFormValid()}>
          Lançar {episSelecionados.length} EPI{episSelecionados.length !== 1 ? "s" : ""}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  )
}
