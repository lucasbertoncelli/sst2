"use client"

interface CSSAreaChartProps {
  data?: Array<{ month: string; entregas: number }>
}

export function CSSAreaChart({ data }: CSSAreaChartProps) {
  const defaultData = [
    { month: "Fev", entregas: 7 },
    { month: "Mai", entregas: 1 },
    { month: "Jul", entregas: 3 },
    { month: "Ago", entregas: 11 },
  ]

  const chartData = data || defaultData
  const maxValue = 12 // Valor fixo para manter proporções consistentes

  return (
    <div className="relative h-72 p-4">
      <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGradientEPI" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0891b2" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <g stroke="#f1f5f9" strokeWidth="1">
          <line x1="60" y1="40" x2="340" y2="40" />
          <line x1="60" y1="80" x2="340" y2="80" />
          <line x1="60" y1="120" x2="340" y2="120" />
          <line x1="60" y1="160" x2="340" y2="160" />
        </g>

        {/* Área preenchida */}
        <path d="M 60 100 L 160 160 L 240 140 L 340 60 L 340 170 L 60 170 Z" fill="url(#areaGradientEPI)" />

        {/* Linha principal */}
        <path d="M 60 100 L 160 160 L 240 140 L 340 60" fill="none" stroke="#0891b2" strokeWidth="2" />

        {/* Pontos e valores */}
        <g>
          {/* Fev - 7 */}
          <circle cx="60" cy="100" r="4" fill="#0891b2" stroke="white" strokeWidth="2" />
          <text x="60" y="90" textAnchor="middle" className="text-sm font-semibold fill-gray-700">
            7
          </text>

          {/* Mai - 1 */}
          <circle cx="160" cy="160" r="4" fill="#0891b2" stroke="white" strokeWidth="2" />
          <text x="160" y="150" textAnchor="middle" className="text-sm font-semibold fill-gray-700">
            1
          </text>

          {/* Jul - 3 */}
          <circle cx="240" cy="140" r="4" fill="#0891b2" stroke="white" strokeWidth="2" />
          <text x="240" y="130" textAnchor="middle" className="text-sm font-semibold fill-gray-700">
            3
          </text>

          {/* Ago - 11 */}
          <circle cx="340" cy="60" r="4" fill="#0891b2" stroke="white" strokeWidth="2" />
          <text x="340" y="50" textAnchor="middle" className="text-sm font-semibold fill-gray-700">
            11
          </text>
        </g>
      </svg>

      {/* Labels dos meses */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between px-12 text-sm text-gray-600">
        <span>Fev</span>
        <span>Mai</span>
        <span>Jul</span>
        <span>Ago</span>
      </div>

      {/* Removida a legenda "Área de Plotagem" conforme solicitado */}
    </div>
  )
}
