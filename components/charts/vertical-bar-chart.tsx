"use client"

import { useEffect, useState } from "react"

interface VerticalBarChartProps {
  data: Array<{ name: string; value: number }>
  height?: number
}

export function VerticalBarChart({ data, height = 300 }: VerticalBarChartProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedData, setAnimatedData] = useState(data.map((item) => ({ ...item, animatedValue: 0 })))
  const maxValue = Math.max(...data.map((item) => item.value))

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isVisible) {
      const animationTimer = setTimeout(() => {
        setAnimatedData(data.map((item) => ({ ...item, animatedValue: item.value })))
      }, 200)
      return () => clearTimeout(animationTimer)
    }
  }, [isVisible, data])

  return (
    <div
      className={`flex items-end justify-between space-x-2 px-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{ height }}
    >
      {animatedData.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1 group">
          <div
            className="relative flex flex-col items-center justify-end transition-all duration-300 group-hover:scale-105"
            style={{ height: height - 80 }}
          >
            <span
              className={`text-xs font-bold text-cyan-600 mb-1 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
              style={{ transitionDelay: `${index * 100 + 800}ms` }}
            >
              {item.value}
            </span>
            <div
              className="w-12 bg-cyan-500 rounded-t transition-all duration-1000 ease-out hover:bg-cyan-600 relative overflow-hidden group-hover:shadow-lg"
              style={{
                height: `${(item.animatedValue / maxValue) * (height - 120)}px`,
                minHeight: "20px",
                transitionDelay: `${index * 150}ms`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
            </div>
          </div>
          <div
            className={`text-xs font-medium text-center mt-2 w-full transition-all duration-500 group-hover:text-cyan-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
            style={{ transitionDelay: `${index * 100 + 1000}ms` }}
          >
            <div className="break-words leading-tight">{item.name}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
