"use client"

import { useEffect, useState } from "react"

interface HorizontalBarChartProps {
  data: Array<{ name: string; value: number; percentage?: number }>
  height?: number
  showPercentage?: boolean
  maxValue?: number
}

export function HorizontalBarChart({ data, height = 300, showPercentage = false, maxValue }: HorizontalBarChartProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedData, setAnimatedData] = useState(data.map((item) => ({ ...item, animatedValue: 0 })))
  const max = maxValue || Math.max(...data.map((item) => item.value))

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isVisible) {
      const animationTimer = setTimeout(() => {
        setAnimatedData(data.map((item) => ({ ...item, animatedValue: item.value })))
      }, 100)
      return () => clearTimeout(animationTimer)
    }
  }, [isVisible, data])

  return (
    <div
      className={`space-y-3 transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
      style={{ height }}
    >
      {animatedData.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded transition-all duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="w-32 text-xs font-medium text-left truncate transition-all duration-300 group-hover:text-cyan-700">
            {item.name}
          </div>
          <div className="flex items-center space-x-2 flex-1">
            <div className="flex-1 bg-gray-200 rounded h-6 relative overflow-hidden">
              <div
                className="h-6 bg-cyan-600 rounded transition-all duration-1000 ease-out hover:bg-cyan-800 relative overflow-hidden"
                style={{
                  width: `${(item.animatedValue / max) * 100}%`,
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -skew-x-12 animate-shimmer"></div>
              </div>
            </div>
            <span className="text-xs font-medium w-8 text-right transition-all duration-300 group-hover:text-cyan-700 group-hover:font-bold">
              {showPercentage ? `${item.percentage || item.value}%` : item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
