"use client"

import { useEffect, useState } from "react"

interface AbsenteismoLineChartProps {
  data: any
  height?: number
}

export function AbsenteismoLineChart({ data, height = 300 }: AbsenteismoLineChartProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  // Dados exemplares
  const chartData = [
    { month: "JANEIRO", absenteismo: 2.5 },
    { month: "FEVEREIRO", absenteismo: 2.8 },
    { month: "MARÇO", absenteismo: 3.1 },
    { month: "ABRIL", absenteismo: 2.9 },
    { month: "MAIO", absenteismo: 3.2 },
    { month: "JUNHO", absenteismo: 2.7 },
    { month: "JULHO", absenteismo: 2.4 },
    { month: "AGOSTO", absenteismo: 2.6 },
    { month: "SETEMBRO", absenteismo: 2.8 },
    { month: "OUTUBRO", absenteismo: 3.0 },
    { month: "NOVEMBRO", absenteismo: 2.5 },
    { month: "DEZEMBRO", absenteismo: 2.3 },
  ]

  const maxValue = 4.0
  const metaValue = 3.0
  const chartWidth = 800
  const chartHeight = 250
  const padding = { top: 40, right: 40, bottom: 80, left: 60 }

  // Calcular posições dos pontos
  const points = chartData.map((item, index) => {
    const x = padding.left + (index * (chartWidth - padding.left - padding.right)) / (chartData.length - 1)
    const y = padding.top + ((maxValue - item.absenteismo) / maxValue) * (chartHeight - padding.top - padding.bottom)
    return { x, y, value: item.absenteismo, month: item.month }
  })

  // Linha META
  const metaY = padding.top + ((maxValue - metaValue) / maxValue) * (chartHeight - padding.top - padding.bottom)

  // Criar path da linha
  const linePath = points.reduce((path, point, index) => {
    return path + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`)
  }, "")

  return (
    <div
      className={`relative transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <div className="bg-gray-100 p-4 rounded-lg relative">
        {/* Label "Área de Plotagem" */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-white border border-gray-300 px-2 py-1 rounded z-10">
          Área de Plotagem
        </div>

        {/* SVG Chart */}
        <div className="w-full overflow-x-auto">
          <svg width={chartWidth} height={chartHeight} className="w-full h-auto">
            {/* Grid lines Y */}
            {[0, 1, 2, 3, 4].map((value) => {
              const y = padding.top + ((maxValue - value) / maxValue) * (chartHeight - padding.top - padding.bottom)
              return (
                <g key={value}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  <text x={padding.left - 10} y={y + 4} fontSize="10" fill="#6b7280" textAnchor="end">
                    {value},0%
                  </text>
                </g>
              )
            })}

            {/* Linha META tracejada */}
            <line
              x1={padding.left}
              y1={metaY}
              x2={chartWidth - padding.right}
              y2={metaY}
              stroke="#374151"
              strokeWidth="2"
              strokeDasharray="8,4"
            />

            {/* Linha do Absenteísmo */}
            <path d={linePath} fill="none" stroke="#f97316" strokeWidth="3" className="transition-all duration-2000" />

            {/* Pontos da linha */}
            {points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="5"
                fill="#f97316"
                stroke="#f97316"
                strokeWidth="2"
                className="hover:r-7 transition-all duration-300 cursor-pointer"
              />
            ))}

            {/* Labels dos meses */}
            {points.map((point, index) => (
              <text
                key={index}
                x={point.x}
                y={chartHeight - padding.bottom + 20}
                fontSize="10"
                fill="#374151"
                textAnchor="middle"
                transform={`rotate(-45, ${point.x}, ${chartHeight - padding.bottom + 20})`}
              >
                {point.month}
              </text>
            ))}
          </svg>
        </div>

        {/* Legenda */}
        <div className="flex justify-center mt-4 space-x-8 text-xs">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="w-6 h-0.5 bg-orange-500"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full -ml-1"></div>
            </div>
            <span className="font-medium">ABSENTEÍSMO (%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-0.5 border-t-2 border-dashed border-gray-600"></div>
            <span className="font-medium">META</span>
          </div>
        </div>
      </div>
    </div>
  )
}
