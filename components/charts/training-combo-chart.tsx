"use client"

import { useEffect, useState } from "react"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Janeiro", planejado: 4, realizado: 1 },
  { month: "Fevereiro", planejado: 4, realizado: 1 },
  { month: "Março", planejado: 0, realizado: 1 },
  { month: "Abril", planejado: 4, realizado: 0 },
  { month: "Maio", planejado: 0, realizado: 1 },
  { month: "Junho", planejado: 2, realizado: 2 },
  { month: "Julho", planejado: 2, realizado: 2 },
  { month: "Agosto", planejado: 4, realizado: 2 },
  { month: "Setembro", planejado: 1, realizado: 1 },
  { month: "Outubro", planejado: 4, realizado: 4 },
  { month: "Novembro", planejado: 4, realizado: 4 },
  { month: "Dezembro", planejado: 4, realizado: 4 },
]

export function TrainingComboChart() {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  if (!isBrowser) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-md">
        <div className="text-sm text-gray-500">Carregando gráfico...</div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: "#666" }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#666" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        />
        <Bar dataKey="planejado" fill="#0ea5e9" name="Treinamentos planejados" radius={[2, 2, 0, 0]} />
        <Line
          type="monotone"
          dataKey="realizado"
          stroke="#64748b"
          strokeWidth={2}
          name="Treinamentos realizados"
          dot={{ fill: "#64748b", strokeWidth: 2, r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
