import type React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface EpiAreaChartProps {
  data: { date: string; value: number }[]
  dataKey: string
  stroke: string
  fill: string
}

const EpiAreaChart: React.FC<EpiAreaChartProps> = ({ data, dataKey, stroke, fill }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" axisLine={false} tickLine={false} />
        <YAxis hide={true} />
        <Tooltip />
        <Area type="monotone" dataKey={dataKey} stroke={stroke} fill={fill} name="" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default EpiAreaChart
