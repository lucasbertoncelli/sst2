"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardDDSProps {
  selectedMonth: string
  selectedSector: string
}

export function DashboardDDS({ selectedMonth, selectedSector }: DashboardDDSProps) {
  return (
    <div className="space-y-6">
      {/* KPI Cards with blue gradient background */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-center">META DE REUNIÕES DDS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-center">5.040</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-center">REUNIÕES DDS REALIZADAS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-center">7</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-center">PORCENTAGEM DE REUNIÕES</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-center">0,1%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-center">PORCENTAGEM DE ADERÊNCIA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-center">0,0%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Meetings Chart */}
        <Card className="border-cyan-200">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-sm font-medium text-cyan-900">
              REUNIÕES MENSAIS DA EMPRESA X META DE REUNIÕES
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="bg-gray-50 p-4 h-64 relative">
              {/* Horizontal dotted line for META */}
              <div className="absolute top-1/3 left-0 right-0 border-t-2 border-dashed border-red-500"></div>

              {/* Bar chart with months */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-3/4 px-4">
                {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map(
                  (month, i) => (
                    <div key={month} className="flex flex-col items-center">
                      <div
                        className="bg-[#0891b2] w-4"
                        style={{
                          height: i === 0 ? "100px" : "0px",
                          transition: "height 1s ease-in-out",
                        }}
                      ></div>
                      <div className="text-xs mt-2">{month}</div>
                      <div className="text-xs font-bold">{i === 0 ? "7" : "0"}</div>
                    </div>
                  ),
                )}
              </div>

              {/* Legend */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-8 pb-2">
                <div className="flex items-center">
                  <div className="w-4 h-2 bg-[#0891b2] mr-2"></div>
                  <span className="text-xs">REUNIÕES MENSAIS</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-0 border-t-2 border-dashed border-red-500 mr-2"></div>
                  <span className="text-xs">META MENSAL</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sector Meetings Chart */}
        <Card className="border-cyan-200">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-sm font-medium text-cyan-900">
              REUNIÕES DA EMPRESA POR SETOR X METAS POR SETOR
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="bg-gray-50 p-4 h-64 relative">
              {/* Line chart for targets */}
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                <path
                  d="M 50,50 L 100,70 L 150,50 L 200,50 L 250,150 L 300,50 L 350,70"
                  fill="none"
                  stroke="#0891b2"
                  strokeWidth="3"
                />
              </svg>

              {/* Bar chart with sectors */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-3/4 px-4">
                {["CQP", "Enfermaria", "Expedição", "Man. Mecânica", "Marketing", "PCP", "T.I"].map((sector, i) => (
                  <div key={sector} className="flex flex-col items-center">
                    <div
                      className="bg-[#0891b2] w-4"
                      style={{
                        height: i === 4 ? "35px" : "5px",
                        transition: "height 1s ease-in-out",
                      }}
                    ></div>
                    <div className="text-xs mt-2 max-w-[40px] text-center">{sector}</div>
                    <div className="text-xs font-bold">{i === 4 ? "35" : "1"}</div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-8 pb-2">
                <div className="flex items-center">
                  <div className="w-4 h-2 bg-[#0891b2] mr-2"></div>
                  <span className="text-xs">REUNIÕES POR SETOR</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-2 bg-[#0891b2] mr-2"></div>
                  <span className="text-xs">META POR SETOR</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expected vs Actual Chart */}
        <Card className="border-cyan-200">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-sm font-medium text-cyan-900">PREVISTO X REALIZADO</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="bg-gray-50 p-4 h-64 flex items-end justify-center space-x-16">
              <div className="flex flex-col items-center">
                <div className="text-sm font-bold mb-2">280</div>
                <div className="bg-[#06b6d4] w-24" style={{ height: "180px" }}></div>
                <div className="text-xs mt-2">PARTICIPANTES PREVISTOS</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-sm font-bold mb-2">210</div>
                <div className="bg-[#0891b2] w-24" style={{ height: "140px" }}></div>
                <div className="text-xs mt-2">EMPREGADOS PRESENTES</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top 5 Managers Chart */}
        <Card className="border-cyan-200">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-sm font-medium text-cyan-900">TOP 5 GESTORES ADERÊNCIA</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="bg-gray-50 p-4 h-64 flex flex-col justify-between">
              {[
                "Jadir Moraes",
                "Fernanda Onofre",
                "Fernanda Charneski",
                "Fabiano Rodrigues",
                "Endrew Britto",
                "Claudio Faria",
                "Aline Trindade",
              ].map((manager) => (
                <div key={manager} className="flex items-center mb-2">
                  <div className="text-xs w-32">{manager}</div>
                  <div className="flex-1 h-6 bg-[#0891b2] relative">
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-xs">75,0%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shift Distribution Chart */}
        <Card className="border-cyan-200 md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-sm font-medium text-cyan-900">REUNIÕES POR TURNO</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="bg-gray-50 p-4 h-64 flex justify-center items-center">
              <div className="relative w-40 h-40">
                {/* Donut chart */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#06b6d4"
                    strokeWidth="20"
                    strokeDasharray="251.2 502.4"
                    strokeDashoffset="0"
                  ></circle>
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#0891b2"
                    strokeWidth="20"
                    strokeDasharray="125.6 502.4"
                    strokeDashoffset="-125.6"
                  ></circle>
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">7</span>
                </div>
              </div>
              {/* Legend */}
              <div className="ml-8">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-[#06b6d4] mr-2"></div>
                  <span className="text-xs">ADM (2)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#0891b2] mr-2"></div>
                  <span className="text-xs">Turno 1 (5)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
