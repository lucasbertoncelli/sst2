"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface GenderPieChartProps {
  data: any[]
  height?: number
}

export function GenderPieChart({ data, height = 300 }: GenderPieChartProps) {
  const COLORS = {
    Masculino: "#1e3a8a",
    Feminino: "#f97316",
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Ícones de gênero no centro */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-600">
          {/* Ícone masculino */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 9.55 14.55 10 14 10C13.45 10 13 9.55 13 9V7H11V9C11 9.55 10.55 10 10 10C9.45 10 9 9.55 9 9V7H3V9C3 10.1 3.9 11 5 11V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V11C20.1 11 21 10.1 21 9Z" />
          </svg>

          <div className="w-px h-6 bg-gray-400"></div>

          {/* Ícone feminino */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM7 22H9V20H15V22H17V20C17 19.45 16.55 19 16 19H15V11C15 9.9 14.1 9 13 9H11C9.9 9 9 9.9 9 11V19H8C7.45 19 7 19.45 7 20V22Z" />
          </svg>
        </div>
      </div>

      {/* Legenda personalizada */}
      <div className="mt-4 flex justify-center space-x-6">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] }}
            ></div>
            <span className="text-xs font-medium">{entry.name}</span>
            <span className="text-xs font-bold">{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
