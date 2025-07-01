"use client"

const data = [
  { name: "Antônio Coutinho", value: 7, color: "#0e7490" },
  { name: "Jorge Benjor", value: 7, color: "#0c4a6e" },
  { name: "Neymar Osório", value: 3, color: "#0891b2" },
  { name: "Marcos Toledo", value: 4, color: "#06b6d4" },
  { name: "Luis Otavio", value: 1, color: "#22d3ee" },
]

export function CSSEPIDonutChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  return (
    <div className="flex items-center justify-center h-72">
      <div className="relative">
        {/* Donut Chart */}
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const angle = (percentage / 100) * 360
              const startAngle = currentAngle
              currentAngle += angle

              const radius = 35
              const centerX = 50
              const centerY = 50

              const startAngleRad = (startAngle * Math.PI) / 180
              const endAngleRad = ((startAngle + angle) * Math.PI) / 180

              const x1 = centerX + radius * Math.cos(startAngleRad)
              const y1 = centerY + radius * Math.sin(startAngleRad)
              const x2 = centerX + radius * Math.cos(endAngleRad)
              const y2 = centerY + radius * Math.sin(endAngleRad)

              const largeArcFlag = angle > 180 ? 1 : 0

              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                "Z",
              ].join(" ")

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color}
                  className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                  title={`${item.name}: ${item.value} recebimentos`}
                />
              )
            })}

            {/* Inner circle to create donut effect */}
            <circle cx="50" cy="50" r="20" fill="white" />
          </svg>
        </div>

        {/* Legend */}
        <div className="absolute left-52 top-0 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-gray-700">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
