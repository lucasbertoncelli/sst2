"use client"

import { useEffect, useState } from "react"

export function TrainingDonutChart() {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedPlanejado, setAnimatedPlanejado] = useState(0)
  const [animatedRealizado, setAnimatedRealizado] = useState(0)
  const [isBrowser, setIsBrowser] = useState(false)

  const planejado = 79
  const realizado = 21

  const circumference = 2 * Math.PI * 45

  useEffect(() => {
    setIsBrowser(true)
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isVisible && isBrowser) {
      const animationTimer = setTimeout(() => {
        setAnimatedPlanejado(planejado)
        setAnimatedRealizado(realizado)
      }, 300)
      return () => clearTimeout(animationTimer)
    }
  }, [isVisible, planejado, realizado, isBrowser])

  if (!isBrowser) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-md">
        <div className="text-sm text-gray-500">Carregando gráfico...</div>
      </div>
    )
  }

  const planejadoStroke = (animatedPlanejado / 100) * circumference
  const realizadoStroke = (animatedRealizado / 100) * circumference

  return (
    <div
      className={`flex flex-col items-center transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
    >
      <div className="relative group" style={{ width: 200, height: 200 }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="10"
            strokeDasharray={`${planejadoStroke} ${circumference}`}
            strokeDashoffset="0"
            className="transition-all duration-2000 ease-out"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="10"
            strokeDasharray={`${realizadoStroke} ${circumference}`}
            strokeDashoffset={-planejadoStroke}
            className="transition-all duration-2000 ease-out"
          />
        </svg>

        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">{planejado}%</div>
          </div>
        </div>
      </div>

      <div
        className={`mt-4 flex justify-center space-x-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-900 rounded"></div>
          <span className="text-xs">Treinamentos planejados</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-sky-500 rounded"></div>
          <span className="text-xs">Treinamentos realizados</span>
        </div>
      </div>
    </div>
  )
}
