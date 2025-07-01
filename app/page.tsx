"use client"

import { useState, Suspense } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardSelector, type DashboardType } from "@/components/dashboard-selector"
import { DashboardGeral } from "@/components/dashboards/dashboard-geral"
import { DashboardAbsenteismo } from "@/components/dashboards/dashboard-absenteismo"
import { DashboardAcidentes } from "@/components/dashboards/dashboard-acidentes"
import { DashboardDDS } from "@/components/dashboards/dashboard-dds"
import { DashboardEPIs } from "@/components/dashboards/dashboard-epis"
import { DashboardTreinamentos } from "@/components/dashboards/dashboard-treinamentos"

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState("janeiro")
  const [selectedSector, setSelectedSector] = useState("todos")
  const [selectedDashboard, setSelectedDashboard] = useState<DashboardType>("geral")

  const getDashboardTitle = (dashboard: DashboardType) => {
    const titles = {
      geral: "Painel de Controle Geral",
      absenteismo: "Dashboard de Absenteísmo",
      acidentes: "Dashboard de Acidentes e Incidentes",
      dds: "Dashboard de DDS",
      epis: "Dashboard de EPIs",
      treinamentos: "Dashboard de Treinamentos",
    }
    return titles[dashboard]
  }

  const renderDashboard = () => {
    const props = { selectedMonth, selectedSector }

    switch (selectedDashboard) {
      case "absenteismo":
        return <DashboardAbsenteismo {...props} />
      case "acidentes":
        return <DashboardAcidentes {...props} />
      case "dds":
        return <DashboardDDS {...props} />
      case "epis":
        return <DashboardEPIs {...props} />
      case "treinamentos":
        return <DashboardTreinamentos {...props} />
      default:
        return <DashboardGeral {...props} />
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{getDashboardTitle(selectedDashboard)}</h1>
        <p className="text-muted-foreground">
          Visão geral dos indicadores de RH e Segurança do Trabalho
          {selectedMonth !== "todos" && ` - ${selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)}`}
          {selectedSector !== "todos" && ` - ${selectedSector}`}
        </p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <DashboardSelector value={selectedDashboard} onValueChange={setSelectedDashboard} />

        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o mês" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="janeiro">Janeiro</SelectItem>
            <SelectItem value="fevereiro">Fevereiro</SelectItem>
            <SelectItem value="marco">Março</SelectItem>
            <SelectItem value="abril">Abril</SelectItem>
            <SelectItem value="maio">Maio</SelectItem>
            <SelectItem value="junho">Junho</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSector} onValueChange={setSelectedSector}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o setor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os setores</SelectItem>
            <SelectItem value="Produção">Produção</SelectItem>
            <SelectItem value="Qualidade">Qualidade</SelectItem>
            <SelectItem value="Manutenção">Manutenção</SelectItem>
            <SelectItem value="Administração">Administração</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Suspense fallback={<div>Carregando dashboard...</div>}>{renderDashboard()}</Suspense>
    </div>
  )
}
