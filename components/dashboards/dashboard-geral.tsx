import { DashboardCards } from "@/components/dashboard-cards"
import { IndicadoresChart } from "@/components/charts/line-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"

interface DashboardGeralProps {
  selectedMonth: string
  selectedSector: string
}

export function DashboardGeral({ selectedMonth, selectedSector }: DashboardGeralProps) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Carregando dashboard geral...</div>}>
        <DashboardCards />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>Indicadores Mensais</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Carregando gráficos...</div>}>
            <IndicadoresChart />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
