"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertCircle, Users, DollarSign, CheckCircle } from "lucide-react"
import { CSSAreaChart } from "@/components/charts/css-area-chart"
import { CSSHorizontalBarChart } from "@/components/charts/css-horizontal-bar-chart"
import { CSSEPIDonutChart } from "@/components/charts/css-epi-donut-chart"

interface DashboardEPIsProps {
  selectedMonth: string
  selectedSector: string
}

const equipamentosEstoque = [
  { name: "Cinto de Segurança Individual", value: 15 },
  { name: "Capacete Protetor", value: 14 },
  { name: "Óculos Escuros de proteção", value: 13 },
  { name: "Botina Bico de Polipropileno", value: 11 },
  { name: "Creme Solar 60 FPS", value: 11 },
  { name: "Botina Bico de Ferro", value: 11 },
  { name: "Luva de Pano", value: 10 },
  { name: "Luva de Vaqueta", value: 9 },
  { name: "Óculos de Proteção Modelo 1", value: 8 },
]

const equipamentosEntregues = [
  { name: "Óculos de Proteção Modelo 1", value: 4 },
  { name: "Capacete Protetor", value: 4 },
  { name: "Botina Bico de Ferro", value: 4 },
  { name: "Cinto de Segurança Individual", value: 3 },
  { name: "Luva de Pano", value: 2 },
  { name: "Óculos Escuros de proteção", value: 2 },
  { name: "Luva de Vaqueta", value: 1 },
  { name: "Botina Bico de Polipropileno", value: 1 },
  { name: "Creme Solar 60 FPS", value: 1 },
]

const entregasMensais = [
  { month: "Fev", entregas: 7 },
  { month: "Mai", entregas: 1 },
  { month: "Jul", entregas: 3 },
  { month: "Ago", entregas: 11 },
]

export function DashboardEPIs({ selectedMonth, selectedSector }: DashboardEPIsProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const chartColors = {
    primary: "#0ea5e9",
    secondary: "#1e3a8a",
    tertiary: "#0891b2",
  }

  return (
    <div className="space-y-6">
      {/* Cards KPI */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        <Card className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white hover:scale-105 transition-transform duration-300 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gasto com EPI</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 6.330</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white hover:scale-105 transition-transform duration-300 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Inicial</CardTitle>
            <Package className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white hover:scale-105 transition-transform duration-300 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white hover:scale-105 transition-transform duration-300 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Estoque</CardTitle>
            <Package className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">102</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white hover:scale-105 transition-transform duration-300 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Entregues</CardTitle>
            <CheckCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white hover:scale-105 transition-transform duration-300 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total EPI Status "Trocar"</CardTitle>
            <AlertCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white hover:scale-105 transition-transform duration-300 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total EPI Status "Expirado"</CardTitle>
            <AlertCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* TOP 10 Equipamentos em Estoque */}
        <Card className="hover:shadow-lg transition-shadow duration-300 border-cyan-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-cyan-900">TOP 10 Equipamentos em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            {isMounted && <CSSHorizontalBarChart data={equipamentosEstoque} colors={chartColors} />}
          </CardContent>
        </Card>

        {/* Quantidade de Entrega de equipamentos mensal */}
        <Card className="hover:shadow-lg transition-shadow duration-300 border-cyan-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-cyan-900">
              Quantidade de Entrega de equipamentos mensal
            </CardTitle>
          </CardHeader>
          <CardContent>{isMounted && <CSSAreaChart data={entregasMensais} colors={chartColors} />}</CardContent>
        </Card>

        {/* TOP 10 Recebimentos por Funcionário */}
        <Card className="hover:shadow-lg transition-shadow duration-300 border-cyan-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-cyan-900">TOP 10 Recebimentos por Funcionário</CardTitle>
          </CardHeader>
          <CardContent>{isMounted && <CSSEPIDonutChart colors={chartColors} />}</CardContent>
        </Card>

        {/* Equipamentos Entregues */}
        <Card className="hover:shadow-lg transition-shadow duration-300 border-cyan-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-cyan-900">Equipamentos Entregues</CardTitle>
          </CardHeader>
          <CardContent>
            {isMounted && <CSSHorizontalBarChart data={equipamentosEntregues} colors={chartColors} />}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
