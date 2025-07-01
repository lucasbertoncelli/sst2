"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Shield, TrendingDown, Clock } from "lucide-react"
import { useState } from "react"

interface DashboardAcidentesProps {
  selectedMonth: string
  selectedSector: string
}

interface TooltipProps {
  x: number
  y: number
  content: string
  visible: boolean
}

function Tooltip({ x, y, content, visible }: TooltipProps) {
  if (!visible) return null

  return (
    <div
      className="absolute z-50 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none transition-opacity duration-200"
      style={{
        left: x,
        top: y - 30,
        transform: "translateX(-50%)",
      }}
    >
      {content}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  )
}

export function DashboardAcidentes({ selectedMonth, selectedSector }: DashboardAcidentesProps) {
  const [tooltip, setTooltip] = useState<TooltipProps>({ x: 0, y: 0, content: "", visible: false })

  const showTooltip = (event: React.MouseEvent, content: string) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltip({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      content,
      visible: true,
    })
  }

  const hideTooltip = () => {
    setTooltip((prev) => ({ ...prev, visible: false }))
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105 border border-cyan-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acidentes no Mês</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Janeiro 2024 <span className="text-green-600">-50%</span>
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105 border border-cyan-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidentes</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Este mês <span className="text-yellow-600">+12%</span>
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105 border border-cyan-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dias sem Acidentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              Consecutivos <span className="text-green-600">+5</span>
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105 border border-cyan-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Frequência</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2</div>
            <p className="text-xs text-muted-foreground">
              Por 100 funcionários <span className="text-green-600">-0.8</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Primeira linha de gráficos - 4 colunas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Acidentes por sexo */}
        <Card className="transition-all duration-300 hover:shadow-lg border border-cyan-200">
          <CardHeader className="bg-cyan-700 text-white">
            <CardTitle className="text-sm">Acidentes por sexo</CardTitle>
          </CardHeader>
          <CardContent className="p-4 relative">
            <div className="relative w-32 h-32 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Círculo feminino (verde) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray="54.98 219.91"
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-300 hover:stroke-green-400 cursor-pointer"
                  onMouseEnter={(e) => showTooltip(e, "Feminino: 10 acidentes (22%)")}
                  onMouseLeave={hideTooltip}
                />
                {/* Círculo masculino (azul escuro) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#0891b2"
                  strokeWidth="12"
                  strokeDasharray="164.93 219.91"
                  strokeDashoffset="-54.98"
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-300 hover:stroke-slate-600 cursor-pointer"
                  onMouseEnter={(e) => showTooltip(e, "Masculino: 35 acidentes (78%)")}
                  onMouseLeave={hideTooltip}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">45</span>
              </div>
            </div>

            {/* Ícones e legenda */}
            <div className="flex justify-between items-center mt-4">
              <div
                className="flex flex-col items-center transition-all duration-300 hover:scale-110 cursor-pointer"
                onMouseEnter={(e) => showTooltip(e, "Masculino: 35 acidentes")}
                onMouseLeave={hideTooltip}
              >
                <svg className="w-8 h-8 text-slate-700 mb-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 10.1 15.9 11 17 11V20C17 21.1 16.1 22 15 22H13C11.9 22 11 21.1 11 20V16H9V20C9 21.1 8.1 22 7 22H5C3.9 22 3 21.1 3 20V11C4.1 11 5 10.1 5 9V7H3V9C3 10.1 3.9 11 5 11V20H7V11C8.1 11 9 10.1 9 9V7L12 7" />
                </svg>
                <span className="text-xs font-bold">35</span>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-slate-700 mr-1"></div>
                  <span className="text-xs">M</span>
                </div>
              </div>

              <div
                className="flex flex-col items-center transition-all duration-300 hover:scale-110 cursor-pointer"
                onMouseEnter={(e) => showTooltip(e, "Feminino: 10 acidentes")}
                onMouseLeave={hideTooltip}
              >
                <svg className="w-8 h-8 text-green-500 mb-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 7C13.1 7 14 7.9 14 9V11.5L16.5 9.5L17.5 10.5L14.5 13L17.5 15.5L16.5 16.5L14 14.5V22H10V14.5L7.5 16.5L6.5 15.5L9.5 13L6.5 10.5L7.5 9.5L10 11.5V9C10 7.9 10.9 7 12 7Z" />
                </svg>
                <span className="text-xs font-bold">10</span>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 mr-1"></div>
                  <span className="text-xs">F</span>
                </div>
              </div>
            </div>
            <Tooltip {...tooltip} />
          </CardContent>
        </Card>

        {/* Status da ocorrência */}
        <Card className="transition-all duration-300 hover:shadow-lg border border-cyan-200">
          <CardHeader className="bg-cyan-700 text-white">
            <CardTitle className="text-sm">Status da ocorrência</CardTitle>
          </CardHeader>
          <CardContent className="p-4 relative">
            <div className="relative w-32 h-32 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Concluído - 60% (verde) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray="131.95 219.91"
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-300 hover:stroke-green-400 cursor-pointer"
                  onMouseEnter={(e) => showTooltip(e, "Concluído: 60%")}
                  onMouseLeave={hideTooltip}
                />
                {/* Em andamento - 27% (azul claro) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="12"
                  strokeDasharray="59.38 219.91"
                  strokeDashoffset="-131.95"
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-300 hover:stroke-cyan-400 cursor-pointer"
                  onMouseEnter={(e) => showTooltip(e, "Em andamento: 27%")}
                  onMouseLeave={hideTooltip}
                />
                {/* Não iniciado - 13% (azul escuro) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#0891b2"
                  strokeWidth="12"
                  strokeDasharray="28.58 219.91"
                  strokeDashoffset="-191.33"
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-300 hover:stroke-slate-600 cursor-pointer"
                  onMouseEnter={(e) => showTooltip(e, "Não iniciado: 13%")}
                  onMouseLeave={hideTooltip}
                />
              </svg>

              {/* Percentuais */}
              <div className="absolute top-2 right-2 text-xs font-bold">27%</div>
              <div className="absolute bottom-8 left-2 text-xs font-bold">13%</div>
              <div className="absolute bottom-2 right-8 text-xs font-bold">60%</div>
            </div>

            {/* Legenda */}
            <div className="space-y-1 mt-4 text-xs">
              <div
                className="flex items-center transition-all duration-300 hover:scale-105 cursor-pointer"
                onMouseEnter={(e) => showTooltip(e, "Concluído: 60%")}
                onMouseLeave={hideTooltip}
              >
                <div className="w-3 h-3 bg-green-500 mr-2"></div>
                <span>Concluído</span>
              </div>
              <div
                className="flex items-center transition-all duration-300 hover:scale-105 cursor-pointer"
                onMouseEnter={(e) => showTooltip(e, "Em andamento: 27%")}
                onMouseLeave={hideTooltip}
              >
                <div className="w-3 h-3 bg-cyan-500 mr-2"></div>
                <span>Em andamento</span>
              </div>
              <div
                className="flex items-center transition-all duration-300 hover:scale-105 cursor-pointer"
                onMouseEnter={(e) => showTooltip(e, "Não iniciado: 13%")}
                onMouseLeave={hideTooltip}
              >
                <div className="w-3 h-3 bg-slate-700 mr-2"></div>
                <span>Não iniciado</span>
              </div>
            </div>
            <Tooltip {...tooltip} />
          </CardContent>
        </Card>

        {/* Acidentes por Ano */}
        <Card className="transition-all duration-300 hover:shadow-lg border border-cyan-200">
          <CardHeader className="bg-cyan-700 text-white">
            <CardTitle className="text-sm">Acidentes por Ano</CardTitle>
          </CardHeader>
          <CardContent className="p-4 relative">
            <div className="flex items-end justify-between h-24 space-x-2">
              {[
                { year: "2022", value: 20, height: "80px" },
                { year: "2023", value: 12, height: "48px" },
                { year: "2020", value: 12, height: "48px" },
                { year: "2021", value: 1, height: "4px" },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-12 bg-green-500 flex items-start justify-center pt-1 transition-all duration-300 hover:bg-green-400 hover:scale-105 cursor-pointer"
                    style={{ height: item.height }}
                    onMouseEnter={(e) => showTooltip(e, `${item.year}: ${item.value} acidentes`)}
                    onMouseLeave={hideTooltip}
                  >
                    <span className="text-white text-xs font-bold">{item.value}</span>
                  </div>
                  <span className="text-xs mt-1 font-medium">{item.year}</span>
                </div>
              ))}
            </div>
            <Tooltip {...tooltip} />
          </CardContent>
        </Card>

        {/* Acidentes por turno */}
        <Card className="transition-all duration-300 hover:shadow-lg border border-cyan-200">
          <CardHeader className="bg-cyan-700 text-white">
            <CardTitle className="text-sm">Acidentes por turno</CardTitle>
          </CardHeader>
          <CardContent className="p-4 relative">
            <div className="space-y-2">
              {[
                { name: "3° Turno", value: 7 },
                { name: "2° Turno", value: 21 },
                { name: "1° Turno", value: 17 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center transition-all duration-300 hover:scale-105 cursor-pointer"
                  onMouseEnter={(e) => showTooltip(e, `${item.name}: ${item.value} acidentes`)}
                  onMouseLeave={hideTooltip}
                >
                  <span className="text-xs w-8">{["3°", "2°", "1°"][index]}</span>
                  <div className="flex-1 mx-2">
                    <div className="w-full bg-gray-200 h-3">
                      <div
                        className="bg-green-500 h-3 transition-all duration-300 hover:bg-green-400"
                        style={{ width: `${(item.value / 21) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs font-bold w-6">{item.value}</span>
                </div>
              ))}
            </div>
            <Tooltip {...tooltip} />
          </CardContent>
        </Card>
      </div>

      {/* Segunda linha - Evolução mensal (span completo) */}
      <div className="grid gap-4">
        <Card className="transition-all duration-300 hover:shadow-lg border border-cyan-200">
          <CardHeader className="bg-cyan-700 text-white">
            <CardTitle className="text-sm">Evolução mensal de acidentes</CardTitle>
          </CardHeader>
          <CardContent className="p-4 relative">
            <div className="h-32">
              <svg viewBox="0 0 360 120" className="w-full h-full">
                {/* Grid de fundo */}
                <defs>
                  <pattern id="grid" width="30" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Linha dos dados */}
                <polyline
                  points="30,20 60,70 90,40 120,90 150,80 180,75 210,40 240,50 270,80 300,80 330,80 360,90"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  className="transition-all duration-300 hover:stroke-green-400"
                />

                {/* Pontos nos dados */}
                {[
                  { x: 30, y: 20, value: 9, month: "Janeiro" },
                  { x: 60, y: 70, value: 3, month: "Fevereiro" },
                  { x: 90, y: 40, value: 7, month: "Março" },
                  { x: 120, y: 90, value: 1, month: "Abril" },
                  { x: 150, y: 80, value: 2, month: "Maio" },
                  { x: 180, y: 75, value: 4, month: "Junho" },
                  { x: 210, y: 40, value: 7, month: "Julho" },
                  { x: 240, y: 50, value: 6, month: "Agosto" },
                  { x: 270, y: 80, value: 2, month: "Setembro" },
                  { x: 300, y: 80, value: 2, month: "Outubro" },
                  { x: 330, y: 80, value: 2, month: "Novembro" },
                  { x: 360, y: 90, value: 1, month: "Dezembro" },
                ].map((point, i) => (
                  <g key={i}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="#10b981"
                      className="transition-all duration-300 hover:r-6 hover:fill-green-400 cursor-pointer"
                      onMouseEnter={(e) => showTooltip(e, `${point.month}: ${point.value} acidentes`)}
                      onMouseLeave={hideTooltip}
                    />
                    <text x={point.x} y={point.y - 8} textAnchor="middle" className="text-xs font-bold" fill="#374151">
                      {point.value}
                    </text>
                  </g>
                ))}

                {/* Labels dos meses */}
                <g className="text-xs" fill="#6b7280">
                  <text x="30" y="110" textAnchor="middle">
                    JAN
                  </text>
                  <text x="60" y="110" textAnchor="middle">
                    FEV
                  </text>
                  <text x="90" y="110" textAnchor="middle">
                    MAR
                  </text>
                  <text x="120" y="110" textAnchor="middle">
                    ABR
                  </text>
                  <text x="150" y="110" textAnchor="middle">
                    MAI
                  </text>
                  <text x="180" y="110" textAnchor="middle">
                    JUN
                  </text>
                  <text x="210" y="110" textAnchor="middle">
                    JUL
                  </text>
                  <text x="240" y="110" textAnchor="middle">
                    AGO
                  </text>
                  <text x="270" y="110" textAnchor="middle">
                    SET
                  </text>
                  <text x="300" y="110" textAnchor="middle">
                    OUT
                  </text>
                  <text x="330" y="110" textAnchor="middle">
                    NOV
                  </text>
                  <text x="360" y="110" textAnchor="middle">
                    DEZ
                  </text>
                </g>
              </svg>
            </div>
            <Tooltip {...tooltip} />
          </CardContent>
        </Card>
      </div>

      {/* Terceira linha - 4 gráficos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Acidentes por tempo na função */}
        <Card className="transition-all duration-300 hover:shadow-lg border border-cyan-200">
          <CardHeader className="bg-cyan-700 text-white">
            <CardTitle className="text-sm">Acidentes por tempo na função</CardTitle>
          </CardHeader>
          <CardContent className="p-4 relative">
            <div className="flex items-end justify-between h-24 space-x-1">
              {[
                { period: "0-12 meses", value: 14 },
                { period: "1-3 anos", value: 11 },
                { period: "3-6 anos", value: 8 },
                { period: "6-9 anos", value: 7 },
                { period: "9-12 anos", value: 3 },
                { period: "12+ anos", value: 2 },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-6 bg-green-500 transition-all duration-300 hover:bg-green-400 hover:scale-105 cursor-pointer"
                    style={{ height: `${item.value * 4}px` }}
                    onMouseEnter={(e) => showTooltip(e, `${item.period}: ${item.value} acidentes`)}
                    onMouseLeave={hideTooltip}
                  ></div>
                  <span className="text-xs mt-1">{["0-12", "1-3", "3-6", "6-9", "9-12", "12+"][index]}</span>
                  <span className="text-xs font-bold">{item.value}</span>
                </div>
              ))}
            </div>
            <Tooltip {...tooltip} />
          </CardContent>
        </Card>

        {/* Ocorrências por tempo de empresa */}
        <Card className="transition-all duration-300 hover:shadow-lg border border-cyan-200">
          <CardHeader className="bg-cyan-700 text-white">
            <CardTitle className="text-sm">Ocorrências por tempo de empresa</CardTitle>
          </CardHeader>
          <CardContent className="p-4 relative">
            <div className="h-24">
              <svg viewBox="0 0 200 80" className="w-full h-full">
                <polyline
                  points="20,20 40,25 60,30 80,35 100,45 120,55 140,60 160,65 180,70"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  className="transition-all duration-300 hover:stroke-green-400"
                />
                {[
                  { x: 20, y: 20, period: "1º ano" },
                  { x: 60, y: 30, period: "2-3 anos" },
                  { x: 100, y: 45, period: "4-5 anos" },
                  { x: 140, y: 60, period: "6-7 anos" },
                  { x: 180, y: 70, period: "8+ anos" },
                ].map((point, i) => (
                  <circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r="3"
                    fill="#10b981"
                    className="transition-all duration-300 hover:r-5 hover:fill-green-400 cursor-pointer"
                    onMouseEnter={(e) => showTooltip(e, `${point.period}: Tendência decrescente`)}
                    onMouseLeave={hideTooltip}
                  />
                ))}
              </svg>
            </div>
            <Tooltip {...tooltip} />
          </CardContent>
        </Card>

        {/* Acidentes por diretoria */}
        <Card className="transition-all duration-300 hover:shadow-lg border border-cyan-200">
          <CardHeader className="bg-cyan-700 text-white">
            <CardTitle className="text-sm">Acidentes por diretoria</CardTitle>
          </CardHeader>
          <CardContent className="p-4 relative">
            <div className="space-y-2">
              {[
                { name: "Caldeiraria", value: 36 },
                { name: "Solda", value: 3 },
                { name: "Manutenção", value: 2 },
                { name: "Usinagem", value: 1 },
                { name: "Administração", value: 1 },
                { name: "Fundição", value: 1 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center transition-all duration-300 hover:scale-105 cursor-pointer"
                  onMouseEnter={(e) => showTooltip(e, `${item.name}: ${item.value} acidentes`)}
                  onMouseLeave={hideTooltip}
                >
                  <span className="text-xs w-16 truncate">{item.name}</span>
                  <div className="flex-1 mx-2">
                    <div className="w-full bg-gray-200 h-2">
                      <div
                        className="bg-green-500 h-2 transition-all duration-300 hover:bg-green-400"
                        style={{ width: `${(item.value / 36) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs font-bold w-6">{item.value}</span>
                </div>
              ))}
            </div>
            <Tooltip {...tooltip} />
          </CardContent>
        </Card>

        {/* Acidentes por sub tipo */}
        <Card className="transition-all duration-300 hover:shadow-lg border border-cyan-200">
          <CardHeader className="bg-cyan-700 text-white">
            <CardTitle className="text-sm">Acidentes por sub tipo</CardTitle>
          </CardHeader>
          <CardContent className="p-4 relative">
            <div className="flex items-end justify-between h-24 space-x-2">
              {[
                { name: "Com afastamento", value: 14 },
                { name: "Doença Ocupacional com afastamento", value: 3 },
                { name: "Doença Ocupacional sem afastamento", value: 5 },
                { name: "Incidente", value: 16 },
                { name: "Sem afastamento", value: 7 },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-8 bg-green-500 transition-all duration-300 hover:bg-green-400 hover:scale-105 cursor-pointer"
                    style={{ height: `${item.value * 3}px` }}
                    onMouseEnter={(e) => showTooltip(e, `${item.name}: ${item.value} casos`)}
                    onMouseLeave={hideTooltip}
                  ></div>
                  <span className="text-xs mt-1 text-center" style={{ fontSize: "8px" }}>
                    {item.name}
                  </span>
                  <span className="text-xs font-bold">{item.value}</span>
                </div>
              ))}
            </div>
            <Tooltip {...tooltip} />
          </CardContent>
        </Card>
      </div>

      {/* Quarta linha - Mapa do corpo e região */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Quantidade de acidentes por parte do corpo */}
        <Card className="transition-all duration-300 hover:shadow-lg border border-cyan-200">
          <CardHeader className="bg-cyan-700 text-white">
            <CardTitle className="text-sm">Quantidade de acidentes por parte do corpo e repr. %</CardTitle>
          </CardHeader>
          <CardContent className="p-4 relative">
            <div className="relative flex items-center justify-center h-80">
              {/* Silhueta humana */}
              <div className="relative">
                <svg viewBox="0 0 200 400" className="w-32 h-64">
                  {/* Cabeça */}
                  <ellipse cx="100" cy="40" rx="25" ry="30" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
                  {/* Pescoço */}
                  <rect x="90" y="70" width="20" height="15" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
                  {/* Tórax */}
                  <rect x="70" y="85" width="60" height="80" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
                  {/* Braço esquerdo */}
                  <rect x="40" y="95" width="30" height="15" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
                  <rect x="35" y="110" width="20" height="40" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
                  <rect x="30" y="150" width="15" height="25" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
                  {/* Braço direito */}
                  <rect x="130" y="95" width="30" height="15" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
                  <rect x="145" y="110" width="20" height="40" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
                  <rect x="155" y="150" width="15" height="25" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
                  {/* Quadril */}
                  <rect x="75" y="165" width="50" height="25" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
                  {/* Perna esquerda */}
                  <rect x="80" y="190" width="18" height="60" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
                  <rect x="78" y="250" width="22" height="50" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
                  <rect x="75" y="300" width="28" height="15" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
                  {/* Perna direita */}
                  <rect x="102" y="190" width="18" height="60" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
                  <rect x="100" y="250" width="22" height="50" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
                  <rect x="97" y="300" width="28" height="15" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
                </svg>
              </div>

              {/* Labels com linhas conectoras - com hover effects */}
              {[
                { name: "CABEÇA/FACE", value: 0, percent: "0%", position: "top-4 left-4" },
                { name: "OLHO", value: 2, percent: "4%", position: "top-8 right-4" },
                { name: "TÓRAX", value: 10, percent: "22%", position: "top-16 left-2" },
                { name: "COSTA", value: 4, percent: "9%", position: "top-20 right-2" },
                { name: "DEDÃO/MÃO", value: 13, percent: "29%", position: "top-32 left-1" },
                { name: "PULSO/BRAÇO/COTOVELO", value: 7, percent: "15%", position: "top-36 right-1" },
                { name: "PERNA/JOELHO", value: 5, percent: "11%", position: "bottom-16 left-2" },
                { name: "PÉ/TORNOZELO", value: 3, percent: "7%", position: "bottom-4 right-8" },
                { name: "OUTROS", value: 1, percent: "2%", position: "top-2 right-16" },
              ].map((item, index) => (
                <div key={index} className={`absolute ${item.position}`}>
                  <div
                    className="bg-yellow-200 px-2 py-1 rounded text-xs font-medium transition-all duration-300 hover:bg-yellow-300 hover:scale-105 cursor-pointer"
                    onMouseEnter={(e) => showTooltip(e, `${item.name}: ${item.value} acidentes (${item.percent})`)}
                    onMouseLeave={hideTooltip}
                  >
                    {item.name} <span className="ml-2 font-bold">{item.value}</span>{" "}
                    <span className={item.value > 5 ? "text-orange-600" : "text-green-600"}>{item.percent}</span>
                  </div>
                  {index < 8 && (
                    <svg className="absolute top-2 left-full w-16 h-8">
                      <line x1="0" y1="4" x2="60" y2="4" stroke="#fbbf24" strokeWidth="2" />
                      <line x1="60" y1="4" x2="60" y2="20" stroke="#fbbf24" strokeWidth="2" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            <Tooltip {...tooltip} />
          </CardContent>
        </Card>

        {/* Por região do Corpo */}
        <Card className="transition-all duration-300 hover:shadow-lg border border-cyan-200">
          <CardHeader className="bg-cyan-700 text-white">
            <CardTitle className="text-sm">Por região do Corpo</CardTitle>
          </CardHeader>
          <CardContent className="p-4 relative">
            <div className="space-y-3">
              {[
                { name: "DEDÃO/MÃO", value: 13, maxValue: 13 },
                { name: "TÓRAX", value: 10, maxValue: 13 },
                { name: "PULSO/BRAÇO/COTOVELO", value: 7, maxValue: 13 },
                { name: "PERNA/JOELHO", value: 5, maxValue: 13 },
                { name: "COSTA", value: 4, maxValue: 13 },
                { name: "PÉ/TORNOZELO", value: 3, maxValue: 13 },
                { name: "OLHO", value: 2, maxValue: 13 },
                { name: "OUTROS", value: 1, maxValue: 13 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center transition-all duration-300 hover:scale-105 cursor-pointer"
                  onMouseEnter={(e) => showTooltip(e, `${item.name}: ${item.value} acidentes`)}
                  onMouseLeave={hideTooltip}
                >
                  <span className="text-xs w-32 text-right pr-2 font-medium">{item.name}</span>
                  <div className="flex-1 mx-2">
                    <div className="w-full bg-gray-200 h-4 rounded">
                      <div
                        className="bg-green-500 h-4 rounded flex items-center justify-end pr-2 transition-all duration-300 hover:bg-green-400"
                        style={{ width: `${(item.value / item.maxValue) * 100}%` }}
                      >
                        <span className="text-white text-xs font-bold">{item.value}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Tooltip {...tooltip} />
          </CardContent>
        </Card>
      </div>

      {/* Quinta linha - 3 gráficos */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Ocorrências em cada gerência */}
        <Card className="transition-all duration-300 hover:shadow-lg border border-cyan-200">
          <CardHeader className="bg-cyan-700 text-white">
            <CardTitle className="text-sm">Ocorrências em cada gerência</CardTitle>
          </CardHeader>
          <CardContent className="p-4 relative">
            <div className="flex items-end justify-center h-24">
              <div className="flex flex-col items-center mx-4">
                <div
                  className="w-16 bg-green-500 transition-all duration-300 hover:bg-green-400 hover:scale-105 cursor-pointer"
                  style={{ height: "80px" }}
                  onMouseEnter={(e) => showTooltip(e, "Setor 2: 44 ocorrências")}
                  onMouseLeave={hideTooltip}
                ></div>
                <span className="text-xs mt-1">Setor 2</span>
                <span className="text-xs font-bold">44</span>
              </div>
              <div className="flex flex-col items-center mx-4">
                <div
                  className="w-16 bg-green-500 transition-all duration-300 hover:bg-green-400 hover:scale-105 cursor-pointer"
                  style={{ height: "4px" }}
                  onMouseEnter={(e) => showTooltip(e, "Setor 9: 1 ocorrência")}
                  onMouseLeave={hideTooltip}
                ></div>
                <span className="text-xs mt-1">Setor 9</span>
                <span className="text-xs font-bold">1</span>
              </div>
            </div>
            <Tooltip {...tooltip} />
          </CardContent>
        </Card>

        {/* Acidentes por Setor */}
        <Card className="transition-all duration-300 hover:shadow-lg border border-cyan-200">
          <CardHeader className="bg-cyan-700 text-white">
            <CardTitle className="text-sm">Acidentes por Setor</CardTitle>
          </CardHeader>
          <CardContent className="p-4 relative">
            <div className="flex items-end justify-center h-24">
              <div className="flex flex-col items-center mx-4">
                <div
                  className="w-16 bg-green-500 transition-all duration-300 hover:bg-green-400 hover:scale-105 cursor-pointer"
                  style={{ height: "80px" }}
                  onMouseEnter={(e) => showTooltip(e, "Setor 2: 44 acidentes")}
                  onMouseLeave={hideTooltip}
                ></div>
                <span className="text-xs mt-1">Setor 2</span>
                <span className="text-xs font-bold">44</span>
              </div>
              <div className="flex flex-col items-center mx-4">
                <div
                  className="w-16 bg-green-500 transition-all duration-300 hover:bg-green-400 hover:scale-105 cursor-pointer"
                  style={{ height: "4px" }}
                  onMouseEnter={(e) => showTooltip(e, "Setor 9: 1 acidente")}
                  onMouseLeave={hideTooltip}
                ></div>
                <span className="text-xs mt-1">Setor 9</span>
                <span className="text-xs font-bold">1</span>
              </div>
            </div>
            <Tooltip {...tooltip} />
          </CardContent>
        </Card>

        {/* Detalhamento da Lesão */}
        <Card className="transition-all duration-300 hover:shadow-lg border border-cyan-200">
          <CardHeader className="bg-cyan-700 text-white">
            <CardTitle className="text-sm">Detalhamento da Lesão</CardTitle>
          </CardHeader>
          <CardContent className="p-4 relative">
            <div className="flex items-end justify-between h-24 space-x-1">
              {[19, 7, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-2 bg-green-500 transition-all duration-300 hover:bg-green-400 hover:scale-105 cursor-pointer"
                    style={{ height: `${value * 3}px` }}
                    onMouseEnter={(e) => showTooltip(e, `Tipo ${index + 1}: ${value} lesões`)}
                    onMouseLeave={hideTooltip}
                  ></div>
                  <span className="text-xs font-bold" style={{ fontSize: "8px" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <Tooltip {...tooltip} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
