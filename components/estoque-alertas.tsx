"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Package, Clock, TrendingDown } from "lucide-react"
import { mockData } from "@/lib/mock-data"
import type { EPI } from "@/types"

interface AlertaEstoque {
  id: string
  epi: EPI
  tipo: "critico" | "baixo" | "vencimento" | "vencido"
  mensagem: string
  prioridade: number
}

export function EstoqueAlertas() {
  const [alertas, setAlertas] = useState<AlertaEstoque[]>([])

  useEffect(() => {
    const gerarAlertas = () => {
      const alertasGerados: AlertaEstoque[] = []
      const hoje = new Date()
      const em30Dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000)

      mockData.epis.forEach((epi) => {
        // Alerta de estoque crítico (menos de 5 unidades)
        if (epi.quantidade <= 5 && epi.quantidade > 0) {
          alertasGerados.push({
            id: `critico-${epi.id}`,
            epi,
            tipo: "critico",
            mensagem: `Estoque crítico: apenas ${epi.quantidade} unidades restantes`,
            prioridade: 1,
          })
        }

        // Alerta de estoque zerado
        if (epi.quantidade === 0) {
          alertasGerados.push({
            id: `zerado-${epi.id}`,
            epi,
            tipo: "critico",
            mensagem: "Estoque zerado - reposição urgente necessária",
            prioridade: 0,
          })
        }

        // Alerta de estoque baixo (menos de 10 unidades)
        if (epi.quantidade > 5 && epi.quantidade <= 10) {
          alertasGerados.push({
            id: `baixo-${epi.id}`,
            epi,
            tipo: "baixo",
            mensagem: `Estoque baixo: ${epi.quantidade} unidades`,
            prioridade: 2,
          })
        }

        // Alerta de vencimento próximo (30 dias)
        if (epi.validade) {
          const validadeDate = new Date(epi.validade)
          if (validadeDate <= em30Dias && validadeDate > hoje) {
            const diasRestantes = Math.ceil((validadeDate.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
            alertasGerados.push({
              id: `vencimento-${epi.id}`,
              epi,
              tipo: "vencimento",
              mensagem: `Vence em ${diasRestantes} dias`,
              prioridade: 3,
            })
          }

          // Alerta de produto vencido
          if (validadeDate <= hoje) {
            alertasGerados.push({
              id: `vencido-${epi.id}`,
              epi,
              tipo: "vencido",
              mensagem: "Produto vencido - remover do estoque",
              prioridade: 1,
            })
          }
        }
      })

      // Ordenar por prioridade (0 = mais crítico)
      alertasGerados.sort((a, b) => a.prioridade - b.prioridade)
      setAlertas(alertasGerados)
    }

    gerarAlertas()
  }, [])

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case "critico":
        return <AlertTriangle className="h-4 w-4" />
      case "baixo":
        return <TrendingDown className="h-4 w-4" />
      case "vencimento":
        return <Clock className="h-4 w-4" />
      case "vencido":
        return <Package className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getAlertVariant = (tipo: string) => {
    switch (tipo) {
      case "critico":
      case "vencido":
        return "destructive"
      case "baixo":
        return "default"
      case "vencimento":
        return "default"
      default:
        return "default"
    }
  }

  const getBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case "critico":
      case "vencido":
        return "destructive"
      case "baixo":
        return "secondary"
      case "vencimento":
        return "outline"
      default:
        return "default"
    }
  }

  if (alertas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Alertas de Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum alerta de estoque no momento</p>
            <p className="text-sm">Todos os EPIs estão com estoque adequado</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Alertas de Estoque
          <Badge variant="secondary">{alertas.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alertas.map((alerta) => (
          <Alert key={alerta.id} variant={getAlertVariant(alerta.tipo)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getAlertIcon(alerta.tipo)}
                <div>
                  <div className="font-medium">{alerta.epi.nome}</div>
                  <AlertDescription className="mt-1">{alerta.mensagem}</AlertDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getBadgeVariant(alerta.tipo)}>
                  {alerta.tipo === "critico" && "Crítico"}
                  {alerta.tipo === "baixo" && "Baixo"}
                  {alerta.tipo === "vencimento" && "Vencimento"}
                  {alerta.tipo === "vencido" && "Vencido"}
                </Badge>
                {alerta.epi.ca && <span className="text-xs text-muted-foreground">CA: {alerta.epi.ca}</span>}
              </div>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  )
}
