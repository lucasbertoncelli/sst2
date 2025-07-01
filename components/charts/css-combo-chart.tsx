"use client"

export function CSSComboChart() {
  const data = [
    { month: "Jan", planejado: 4, realizado: 1 },
    { month: "Fev", planejado: 4, realizado: 1 },
    { month: "Mar", planejado: 0, realizado: 1 },
    { month: "Abr", planejado: 4, realizado: 0 },
    { month: "Mai", planejado: 0, realizado: 1 },
    { month: "Jun", planejado: 2, realizado: 2 },
    { month: "Jul", planejado: 2, realizado: 2 },
    { month: "Ago", planejado: 4, realizado: 2 },
    { month: "Set", planejado: 1, realizado: 1 },
    { month: "Out", planejado: 4, realizado: 4 },
    { month: "Nov", planejado: 4, realizado: 4 },
    { month: "Dez", planejado: 4, realizado: 4 },
  ]

  const maxValue = Math.max(...data.map((d) => Math.max(d.planejado, d.realizado)))

  return (
    <div className="w-full h-[300px] p-4">
      <div className="flex items-end justify-between h-full relative">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-gray-200 w-full"></div>
          ))}
        </div>

        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center relative z-10" style={{ width: "8%" }}>
            {/* Bars */}
            <div className="flex items-end mb-2 relative">
              <div
                className="bg-cyan-500 rounded-t-sm mr-1 hover:bg-cyan-600 transition-colors cursor-pointer group relative"
                style={{
                  height: `${(item.planejado / maxValue) * 200}px`,
                  width: "12px",
                  minHeight: item.planejado > 0 ? "8px" : "0px",
                }}
                title={`Planejado: ${item.planejado}`}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                  {item.planejado}
                </div>
              </div>

              {/* Line point */}
              <div
                className="absolute bg-gray-500 rounded-full border-2 border-white shadow-sm hover:bg-gray-600 transition-colors cursor-pointer"
                style={{
                  width: "8px",
                  height: "8px",
                  bottom: `${(item.realizado / maxValue) * 200}px`,
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
                title={`Realizado: ${item.realizado}`}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">
                  {item.realizado}
                </div>
              </div>
            </div>

            {/* Month label */}
            <div className="text-xs text-gray-600 transform -rotate-45 origin-center mt-2">{item.month}</div>
          </div>
        ))}

        {/* Connect line points */}
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          <polyline
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
            points={data
              .map((item, index) => {
                const x = (index + 0.5) * (100 / data.length)
                const y = 100 - (item.realizado / maxValue) * 66.7
                return `${x}%,${y}%`
              })
              .join(" ")}
          />
        </svg>
      </div>

      {/* Legend */}
      <div className="flex justify-center mt-4 space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-cyan-500 rounded"></div>
          <span className="text-xs">Treinamentos planejados</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <span className="text-xs">Treinamentos realizados</span>
        </div>
      </div>
    </div>
  )
}
