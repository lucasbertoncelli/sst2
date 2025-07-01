"use client"

interface CSSHorizontalBarChartProps {
  data: Array<{ name: string; value: number }>
  maxValue?: number
  color?: string
}

export function CSSHorizontalBarChart({
  data,
  maxValue = Math.max(...data.map((d) => d.value)),
  color = "#0891b2",
}: CSSHorizontalBarChartProps) {
  return (
    <div className="space-y-3 p-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-36 text-xs text-gray-700 text-right truncate" title={item.name}>
            {item.name}
          </div>
          <div className="flex-1 relative">
            <div className="h-6 bg-gray-100 rounded-r-md overflow-hidden">
              <div
                className="h-full transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: color,
                  animation: `slideIn 1s ease-out ${index * 0.1}s both`,
                }}
                title={`${item.name}: ${item.value}`}
              />
            </div>
            <span className="absolute right-2 top-0 h-6 flex items-center text-xs font-medium text-gray-700">
              {item.value}
            </span>
          </div>
        </div>
      ))}
      <style jsx>{`
        @keyframes slideIn {
          from {
            width: 0%;
          }
          to {
            width: ${100}%;
          }
        }
      `}</style>
    </div>
  )
}
