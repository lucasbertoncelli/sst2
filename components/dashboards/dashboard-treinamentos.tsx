"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Target, Users, DollarSign, Clock } from "lucide-react"
import { useEffect, useState } from "react"

import { CSSComboChart } from "@/components/charts/css-combo-chart"
import { CSSDonutChart } from "@/components/charts/css-donut-chart"
import { CSSBarChart } from "@/components/charts/css-bar-chart"

interface DashboardTreinamentosProps {
  selectedMonth: string
  selectedSector: string
}

export function DashboardTreinamentos({ selectedMonth, selectedSector }: DashboardTreinamentosProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Dados para funcionários treinados
  const funcionariosTreinadosData = [
    { name: "Janeiro", value: 47 },
    { name: "Fevereiro", value: 12 },
    { name: "Março", value: 42 },
    { name: "Abril", value: 17 },
    { name: "Maio", value: 0 },
    { name: "Junho", value: 41 },
    { name: "Julho", value: 20 },
    { name: "Agosto", value: 31 },
    { name: "Setembro", value: 21 },
    { name: "Outubro", value: 58 },
    { name: "Novembro", value: 46 },
    { name: "Dezembro", value: 59 },
  ]

  // Dados para custo com treinamentos
  const custoTreinamentosData = [
    { name: "Janeiro", value: 12935 },
    { name: "Fevereiro", value: 5546 },
    { name: "Março", value: 7464 },
    { name: "Abril", value: 5 },
    { name: "Maio", value: 7375 },
    { name: "Junho", value: 8500 },
    { name: "Julho", value: 6342 },
    { name: "Agosto", value: 9751 },
    { name: "Setembro", value: 7183 },
    { name: "Outubro", value: 7745 },
    { name: "Novembro", value: 10035 },
    { name: "Dezembro", value: 10247 },
  ]

  // Dados para horas de treinamento
  const horasTreinamentoData = [
    { name: "Janeiro", value: 40 },
    { name: "Fevereiro", value: 10 },
    { name: "Março", value: 45 },
    { name: "Abril", value: 4 },
    { name: "Maio", value: 0 },
    { name: "Junho", value: 10 },
    { name: "Julho", value: 10 },
    { name: "Agosto", value: 18 },
    { name: "Setembro", value: 20 },
    { name: "Outubro", value: 24 },
    { name: "Novembro", value: 30 },
    { name: "Dezembro", value: 40 },
  ]

  // Fallback enquanto carrega
  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="border-cyan-200">
              <CardHeader className="bg-cyan-500 text-white">
                <div className="h-6"></div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="border-cyan-200">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-100 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cards KPI */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-cyan-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-cyan-600 to-cyan-700 text-white">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6" />
              <div className="text-2xl font-bold">30</div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-xs font-medium text-center text-gray-600">TREINAMENTOS</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-cyan-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-cyan-600 to-cyan-700 text-white">
            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6" />
              <div className="text-2xl font-bold">8</div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-xs font-medium text-center text-gray-600">TREINAMENTOS</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-cyan-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-cyan-600 to-cyan-700 text-white">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <div className="text-2xl font-bold">397</div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-xs font-medium text-center text-gray-600">FUNCIONÁRIOS TREINADOS</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-cyan-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-cyan-600 to-cyan-700 text-white">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6" />
              <div className="text-xl font-bold">R$73.861</div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-xs font-medium text-center text-gray-600">CUSTO COM TREINAMENTOS</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-cyan-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-cyan-600 to-cyan-700 text-white">
            <div className="flex items-center space-x-2">
              <Clock className="h-6 w-6" />
              <div className="text-2xl font-bold">251</div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-xs font-medium text-center text-gray-600">HORAS DE TREINAMENTO</div>
          </CardContent>
        </Card>
      </div>

      {/* Primeira linha de gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-cyan-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-cyan-900">PLANEJADO VS REALIZADO</CardTitle>
          </CardHeader>
          <CardContent>
            <CSSComboChart />
          </CardContent>
        </Card>

        <Card className="border-cyan-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-cyan-900">RELAÇÃO ENTRE PLANEJADO E REALIZADO</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <CSSDonutChart />
          </CardContent>
        </Card>
      </div>

      {/* Segunda linha de gráficos */}
      <div className="grid gap-6 md:grid-cols-1">
        <Card className="border-cyan-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-cyan-900">
              Área do Gráfico
              <br />
              <span className="text-base">QUANTIDADE DE FUNCIONÁRIOS TREINADOS</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CSSBarChart data={funcionariosTreinadosData} height={300} color="#0891b2" />
          </CardContent>
        </Card>
      </div>

      {/* Terceira linha de gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-cyan-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-cyan-900">CUSTO COM TREINAMENTOS</CardTitle>
          </CardHeader>
          <CardContent>
            <CSSBarChart data={custoTreinamentosData} height={300} color="#0891b2" />
          </CardContent>
        </Card>

        <Card className="border-cyan-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-cyan-900">HORAS DE TREINAMENTO</CardTitle>
          </CardHeader>
          <CardContent>
            <CSSBarChart data={horasTreinamentoData} height={300} color="#0891b2" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
