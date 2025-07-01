import { DataTable } from "@/components/data-table"
import { CustomBarChart } from "@/components/charts/bar-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { mockAcidentes } from "@/lib/mock-data"

const acidentesPorMes = [
  { mes: "Jan", acidentes: 4 },
  { mes: "Fev", acidentes: 2 },
  { mes: "Mar", acidentes: 1 },
  { mes: "Abr", acidentes: 3 },
  { mes: "Mai", acidentes: 2 },
  { mes: "Jun", acidentes: 1 },
]

const afastamentosPorTipo = [
  { tipo: "Corte", quantidade: 3 },
  { tipo: "Contusão", quantidade: 2 },
  { tipo: "Queimadura", quantidade: 1 },
  { tipo: "Torção", quantidade: 2 },
]

export default function AcidentesPage() {
  const columns = [
    { key: "funcionario.nome", label: "Funcionário" },
    { key: "tipo", label: "Tipo" },
    { key: "cid", label: "CID" },
    {
      key: "gravidade",
      label: "Gravidade",
      render: (value: string) => (
        <Badge variant={value === "Leve" ? "secondary" : value === "Moderada" ? "default" : "destructive"}>
          {value}
        </Badge>
      ),
    },
    {
      key: "data",
      label: "Data",
      render: (value: Date) => (value ? new Date(value).toLocaleDateString("pt-BR") : "-"),
    },
    { key: "tempoAfastamento", label: "Afastamento (dias)" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Acidentes de Trabalho</h1>
        <p className="text-muted-foreground">Registro e análise de acidentes de trabalho</p>
      </div>

      <div className="flex gap-4">
        <Select defaultValue="2024">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="todos">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Setor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os setores</SelectItem>
            <SelectItem value="producao">Produção</SelectItem>
            <SelectItem value="manutencao">Manutenção</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="todos">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            <SelectItem value="corte">Corte</SelectItem>
            <SelectItem value="contusao">Contusão</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acidentes por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomBarChart data={acidentesPorMes} dataKey="acidentes" xAxisKey="mes" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Afastamentos por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomBarChart data={afastamentosPorTipo} dataKey="quantidade" xAxisKey="tipo" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Acidentes</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={mockAcidentes} columns={columns} />
        </CardContent>
      </Card>
    </div>
  )
}
