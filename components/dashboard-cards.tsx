import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Clock, TrendingDown, AlertTriangle, MessageSquare, Shield } from "lucide-react"

export function DashboardCards() {
  const cards = [
    {
      title: "Treinamentos Concluídos",
      value: "85",
      icon: GraduationCap,
      description: "Este mês",
      trend: "+12%",
    },
    {
      title: "Treinamentos Pendentes",
      value: "23",
      icon: Clock,
      description: "Aguardando realização",
      trend: "-5%",
    },
    {
      title: "Taxa de Absenteísmo",
      value: "3.2%",
      icon: TrendingDown,
      description: "Últimos 30 dias",
      trend: "+0.5%",
    },
    {
      title: "Acidentes no Mês",
      value: "2",
      icon: AlertTriangle,
      description: "Janeiro 2024",
      trend: "-50%",
    },
    {
      title: "DDS Realizados",
      value: "8",
      icon: MessageSquare,
      description: "Este mês",
      trend: "+25%",
    },
    {
      title: "EPIs Vencidos",
      value: "12",
      icon: Shield,
      description: "Próximos 30 dias",
      trend: "+3",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.description} <span className="text-green-600">{card.trend}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
