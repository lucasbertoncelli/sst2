"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type DashboardType = "geral" | "absenteismo" | "acidentes" | "dds" | "epis" | "treinamentos"

interface DashboardSelectorProps {
  value: DashboardType
  onValueChange: (value: DashboardType) => void
}

export function DashboardSelector({ value, onValueChange }: DashboardSelectorProps) {
  const dashboards = [
    { value: "geral", label: "Dashboard Geral" },
    { value: "absenteismo", label: "Absenteísmo" },
    { value: "acidentes", label: "Acidentes e Incidentes" },
    { value: "dds", label: "DDS" },
    { value: "epis", label: "EPIs" },
    { value: "treinamentos", label: "Treinamentos" },
  ]

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Selecione o dashboard" />
      </SelectTrigger>
      <SelectContent>
        {dashboards.map((dashboard) => (
          <SelectItem key={dashboard.value} value={dashboard.value}>
            {dashboard.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
