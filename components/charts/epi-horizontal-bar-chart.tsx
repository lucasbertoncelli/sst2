"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"

interface EPIHorizontalBarChartProps {
  data: Array<{ name: string; value: number }>
  title?: string
  showLabels?: boolean
}

export function EPIHorizontalBarChart({ data: initialData, title, showLabels = true }: EPIHorizontalBarChartProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [data, setData] = useState(initialData)

  useEffect(() => {
    setIsMounted(true)
    // Garantir que os dados estão disponíveis
    setData(initialData)
  }, [initialData])

  if (!isMounted) {
    return <div className="h-[300px] flex items-center justify-center">Carregando gráfico...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="horizontal" margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
        <CartesianGrid horizontal={true} vertical={false} stroke="#f5f5f5" />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          className="text-xs"
          width={150}
          tick={{ fill: "#333", fontSize: 12 }}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white p-3 border rounded-lg shadow-lg">
                  <p className="font-medium">{`${label}: ${payload[0].value}`}</p>
                </div>
              )
            }
            return null
          }}
        />
        <Bar
          dataKey="value"
          fill="#0891b2"
          radius={[0, 4, 4, 0]}
          className="hover:opacity-80 transition-opacity duration-300"
          label={
            showLabels
              ? {
                  position: "right",
                  fill: "#333",
                  fontSize: 12,
                  fontWeight: 500,
                  formatter: (value: number) => `${value}`,
                }
              : false
          }
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
