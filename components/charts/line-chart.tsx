"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", treinamentos: 65, acidentes: 4, absenteismo: 2.1 },
  { month: "Fev", treinamentos: 78, acidentes: 2, absenteismo: 3.2 },
  { month: "Mar", treinamentos: 85, acidentes: 1, absenteismo: 2.8 },
  { month: "Abr", treinamentos: 92, acidentes: 3, absenteismo: 3.5 },
  { month: "Mai", treinamentos: 88, acidentes: 2, absenteismo: 2.9 },
  { month: "Jun", treinamentos: 95, acidentes: 1, absenteismo: 2.4 },
]

export function IndicadoresChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="treinamentos" stroke="#8884d8" strokeWidth={2} name="Treinamentos" />
        <Line type="monotone" dataKey="acidentes" stroke="#82ca9d" strokeWidth={2} name="Acidentes" />
        <Line type="monotone" dataKey="absenteismo" stroke="#ffc658" strokeWidth={2} name="Absenteísmo %" />
      </LineChart>
    </ResponsiveContainer>
  )
}
