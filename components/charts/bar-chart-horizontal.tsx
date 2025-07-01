"use client"

import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface BarChartHorizontalProps {
  data: any[]
  height?: number
  color?: string
}

export function BarChartHorizontal({ data, height = 300, color = "#1e3a8a" }: BarChartHorizontalProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="horizontal" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} width={90} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        />
        <Bar dataKey="value" fill={color} radius={[0, 2, 2, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
