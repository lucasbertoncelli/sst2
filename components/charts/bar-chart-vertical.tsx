"use client"

import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface BarChartVerticalProps {
  data: any[]
  height?: number
  color?: string
}

export function BarChartVertical({ data, height = 300, color = "#f97316" }: BarChartVerticalProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
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
        <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
