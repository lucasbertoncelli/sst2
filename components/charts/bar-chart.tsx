"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface CustomBarChartProps {
  data: any[]
  dataKey: string
  xAxisKey: string
  title?: string
}

export function CustomBarChart({ data, dataKey, xAxisKey, title }: CustomBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={dataKey} fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}
