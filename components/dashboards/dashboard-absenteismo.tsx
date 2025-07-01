"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AbsenteismoLineChart } from "@/components/charts/absenteismo-line-chart"
import { HorizontalBarChart } from "@/components/charts/horizontal-bar-chart"
import { VerticalBarChart } from "@/components/charts/vertical-bar-chart"
import { GenderDonutChart } from "@/components/charts/gender-donut-chart"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { FiltrosPopup } from "@/components/filtros-popup"

interface DashboardAbsenteismoProps {
  selectedMonth: string
  selectedSector: string
}

export function DashboardAbsenteismo({ selectedMonth, selectedSector }: DashboardAbsenteismoProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [filters, setFilters] = useState({
    year: "2023",
    month: selectedMonth || "Junho",
    sector: selectedSector || "Todos",
    tipoAtestado: "Todos",
    nome: "Todos",
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Dados mockados baseados no print
  const kpiData = [
    { title: "Absenteísmo Ano", value: "0,0%", color: "text-white" },
    { title: "Dias Perdidos", value: "111", color: "text-white" },
    { title: "Qtd Horas perdidas", value: "282", color: "text-white" },
    { title: "Horas Totais (Horas + Dias)", value: "1.095,63", color: "text-white" },
    { title: "Idade Média (Anos)", value: "44", color: "text-white" },
    { title: "Tempo Empresa Média (Anos)", value: "15", color: "text-white" },
    { title: "Quantidade TOTAL CID", value: "2.429", color: "text-white" },
  ]

  const motivosAfastamento = [
    { name: "ATESTADO EXTERNO INTEGRAL", value: 66, percentage: 66, color: "#0891b2" },
    { name: "ATESTADO EXTERNO PARCIAL", value: 23, percentage: 23, color: "#0891b2" },
    { name: "ATESTADO INTERNO INTEGRAL", value: 5, percentage: 5, color: "#0891b2" },
    { name: "DENTISTA EXTERNO INTEGRAL", value: 4, percentage: 4, color: "#0891b2" },
    { name: "DENTISTA EXTERNO PARCIAL", value: 2, percentage: 2, color: "#0891b2" },
  ]

  const turnosOcorrencias = [
    { name: "TURNO DFA - JUL05", value: 4, color: "#0891b2" },
    { name: "TERCEIRO TURNO - FEV 04", value: 9, color: "#0891b2" },
    { name: "SEGUNDO TURNO - FEV 04", value: 9, color: "#0891b2" },
    { name: "PRIMEIRO TURNO - INT 40 MIN", value: 18, color: "#0891b2" },
    { name: "TURNO NORMAL - JUL05", value: 70, color: "#0891b2" },
  ]

  const cidQuantidade = [
    { name: "F99", value: 16, color: "#0891b2" },
    { name: "Z049", value: 15, color: "#0891b2" },
    { name: "K089", value: 13, color: "#0891b2" },
    { name: "H573", value: 8, color: "#0891b2" },
    { name: "Z017", value: 7, color: "#0891b2" },
  ]

  const setoresAbsenteismo = [
    { name: "Grv - SGT", value: 28, percentage: 28, color: "#06b6d4" },
    { name: "Grv - NKT", value: 24, percentage: 24, color: "#06b6d4" },
    { name: "Grv - VRM-I", value: 18, percentage: 18, color: "#06b6d4" },
    { name: "Grv - GVB", value: 17, percentage: 17, color: "#06b6d4" },
    { name: "Grv - DFR", value: 5, percentage: 5, color: "#06b6d4" },
  ]

  const genderData = [
    { name: "Masculino", value: 73, color: "#0891b2" },
    { name: "Feminino", value: 27, color: "#0891b2" },
  ]

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters)
  }

  return (
    <div className="space-y-6">
      {/* Botão de Filtros */}
      <div
        className={`flex justify-end transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <Button
          variant="outline"
          className="flex items-center gap-2 hover:scale-105 transition-all duration-300 hover:shadow-md"
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
        {kpiData.map((kpi, index) => (
          <Card
            key={index}
            className={`transition-all duration-500 hover:scale-105 hover:shadow-lg cursor-pointer bg-gradient-to-br from-cyan-600 to-cyan-700 text-white ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-center transition-colors duration-300 hover:text-blue-600">
                {kpi.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold text-center transition-all duration-300 hover:scale-110 ${kpi.color}`}>
                {kpi.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de Absenteísmo Mensal */}
        <Card
          className={`transition-all duration-700 hover:shadow-lg border-cyan-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "800ms" }}
        >
          <CardHeader>
            <CardTitle className="text-sm text-cyan-900">Gráfico de Absenteísmo Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <AbsenteismoLineChart data={{}} height={300} colors={["#0891b2", "#06b6d4", "#0891b2", "#10b981"]} />
          </CardContent>
        </Card>

        {/* TOP 5 Turnos com maiores ocorrências */}
        <Card
          className={`transition-all duration-700 hover:shadow-lg border-cyan-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "900ms" }}
        >
          <CardHeader>
            <CardTitle className="text-sm text-cyan-900">TOP 5 Turnos com maiores ocorrências</CardTitle>
          </CardHeader>
          <CardContent>
            <VerticalBarChart
              data={turnosOcorrencias}
              height={300}
              colors={["#0891b2", "#06b6d4", "#0891b2", "#10b981"]}
            />
          </CardContent>
        </Card>

        {/* TOP 5 Motivos de Afastados */}
        <Card
          className={`transition-all duration-700 hover:shadow-lg border-cyan-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "1000ms" }}
        >
          <CardHeader>
            <CardTitle className="text-sm text-cyan-900">TOP 5 Motivos de Afastados</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart
              data={motivosAfastamento}
              height={250}
              showPercentage={true}
              colors={["#0891b2", "#06b6d4", "#0891b2", "#10b981"]}
            />
          </CardContent>
        </Card>

        {/* Participação Absenteísmo por Gênero */}
        <Card
          className={`transition-all duration-700 hover:shadow-lg border-cyan-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "1100ms" }}
        >
          <CardHeader>
            <CardTitle className="text-sm text-cyan-900">Participação Absenteísmo por Gênero</CardTitle>
          </CardHeader>
          <CardContent>
            <GenderDonutChart data={genderData} height={250} colors={["#0891b2", "#06b6d4", "#0891b2", "#10b981"]} />
          </CardContent>
        </Card>

        {/* TOP 5 Quantidade de CID */}
        <Card
          className={`transition-all duration-700 hover:shadow-lg border-cyan-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "1200ms" }}
        >
          <CardHeader>
            <CardTitle className="text-sm text-cyan-900">TOP 5 Quantidade de CID</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart
              data={cidQuantidade}
              height={250}
              maxValue={16}
              colors={["#0891b2", "#06b6d4", "#0891b2", "#10b981"]}
            />
          </CardContent>
        </Card>

        {/* TOP 5 Setores com maior índice de Absenteísmo */}
        <Card
          className={`transition-all duration-700 hover:shadow-lg border-cyan-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "1300ms" }}
        >
          <CardHeader>
            <CardTitle className="text-sm text-cyan-900">TOP 5 Setores com maior índice de Absenteísmo</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart
              data={setoresAbsenteismo}
              height={250}
              showPercentage={true}
              colors={["#0891b2", "#06b6d4", "#0891b2", "#10b981"]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Popup de Filtros */}
      <FiltrosPopup isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApplyFilters={handleApplyFilters} />
    </div>
  )
}
