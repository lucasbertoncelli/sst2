"use client"

export function CSSDonutChart() {
  const planejado = 79
  const realizado = 21

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 200, height: 200 }}>
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full border-[20px] border-gray-200"></div>

        {/* Planejado segment */}
        <div
          className="absolute inset-0 rounded-full border-[20px] border-transparent border-t-blue-900 border-r-blue-900 border-b-blue-900 transform -rotate-90"
          style={{
            clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((2 * Math.PI * planejado) / 100 - Math.PI / 2)}% ${50 + 50 * Math.sin((2 * Math.PI * planejado) / 100 - Math.PI / 2)}%, 50% 50%)`,
          }}
        ></div>

        {/* Realizado segment */}
        <div
          className="absolute inset-0 rounded-full border-[20px] border-transparent border-t-cyan-500"
          style={{
            transform: `rotate(${planejado * 3.6 - 90}deg)`,
            clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((2 * Math.PI * realizado) / 100 - Math.PI / 2)}% ${50 + 50 * Math.sin((2 * Math.PI * realizado) / 100 - Math.PI / 2)}%, 50% 50%)`,
          }}
        ></div>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">{planejado}%</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-900 rounded"></div>
          <span className="text-xs">Treinamentos planejados</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-cyan-500 rounded"></div>
          <span className="text-xs">Treinamentos realizados</span>
        </div>
      </div>
    </div>
  )
}
