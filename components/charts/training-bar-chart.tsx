"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface TrainingBarChartProps {
  data: any[]
  height?: number
  color?: string
  title?: string
  valueKey?: string
  showValues?: boolean
}

export function TrainingBarChart({
  data,
  height = 300,
  color = "#0ea5e9",
  title,
  valueKey = "value",
  showValues = true,
}: TrainingBarChartProps) {
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
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, angle: -45, textAnchor: "end" }}
          height={60}
        />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        />
        <Bar dataKey={valueKey} fill={color} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
