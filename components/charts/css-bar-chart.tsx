"use client"

interface CSSBarChartProps {
  data: { name: string; value: number }[]
  height?: number
  color?: string
  title?: string
}

export function CSSBarChart({ data, height = 300, color = "#0ea5e9", title }: CSSBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="w-full p-4" style={{ height }}>
      <div className="flex items-end justify-between h-full relative">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border-t border-gray-200 w-full"></div>
          ))}
        </div>

        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center relative z-10"
            style={{ width: `${90 / data.length}%` }}
          >
            {/* Bar */}
            <div
              className="rounded-t-sm hover:opacity-80 transition-opacity cursor-pointer group relative"
              style={{
                backgroundColor: color,
                height: `${(item.value / maxValue) * 80}%`,
                width: "80%",
                minHeight: item.value > 0 ? "4px" : "0px",
              }}
              title={`${item.name}: ${item.value}`}
            >
              {/* Value label */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">
                {item.value}
              </div>
            </div>

            {/* Name label */}
            <div className="text-xs text-gray-600 transform -rotate-45 origin-center mt-2 whitespace-nowrap">
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
