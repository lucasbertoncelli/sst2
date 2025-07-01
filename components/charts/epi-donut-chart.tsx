"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const chartData = [
  { name: "Antônio Coutinho", value: 7, color: "#0e7490" },
  { name: "Jorge Benjor", value: 7, color: "#0c4a6e" },
  { name: "Neymar Osório", value: 3, color: "#0891b2" },
  { name: "Marcos Toledo", value: 4, color: "#06b6d4" },
  { name: "Luis Otavio", value: 1, color: "#22d3ee" },
]

export function EPIDonutChart() {
  const [isMounted, setIsMounted] = useState(false)
  const [data, setData] = useState(chartData)

  useEffect(() => {
    setIsMounted(true)
    // Garantir que os dados estão disponíveis
    setData(chartData)
  }, [])

  if (!isMounted) {
    return <div className="h-[300px] flex items-center justify-center">Carregando gráfico...</div>
  }

  return (
    <div className="flex items-center justify-center">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-white p-3 border rounded-lg shadow-lg">
                    <p className="font-medium">{`${data.name}: ${data.value} recebimentos`}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend
            verticalAlign="middle"
            align="right"
            layout="vertical"
            iconType="circle"
            wrapperStyle={{ paddingLeft: "20px", fontSize: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
