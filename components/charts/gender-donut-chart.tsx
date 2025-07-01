"use client"

import { useEffect, useState } from "react"

interface GenderDonutChartProps {
  data: Array<{ name: string; value: number }>
  height?: number
}

export function GenderDonutChart({ data, height = 300 }: GenderDonutChartProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedMasculino, setAnimatedMasculino] = useState(0)
  const [animatedFeminino, setAnimatedFeminino] = useState(0)

  const masculino = data.find((item) => item.name === "Masculino")?.value || 73
  const feminino = data.find((item) => item.name === "Feminino")?.value || 27

  const circumference = 2 * Math.PI * 45

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isVisible) {
      const animationTimer = setTimeout(() => {
        setAnimatedMasculino(masculino)
        setAnimatedFeminino(feminino)
      }, 300)
      return () => clearTimeout(animationTimer)
    }
  }, [isVisible, masculino, feminino])

  const masculinoStroke = (animatedMasculino / 100) * circumference
  const femininoStroke = (animatedFeminino / 100) * circumference

  return (
    <div
      className={`flex flex-col items-center transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
    >
      <div className="relative group" style={{ width: height * 0.8, height: height * 0.8 }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          className="transform -rotate-90 transition-transform duration-500 group-hover:scale-105"
        >
          {/* Círculo de fundo */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
          {/* Segmento masculino */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#0891b2"
            strokeWidth="10"
            strokeDasharray={`${masculinoStroke} ${circumference}`}
            strokeDashoffset="0"
            className="transition-all duration-2000 ease-out"
            style={{
              strokeDasharray: `${masculinoStroke} ${circumference}`,
              animation: isVisible ? "drawCircle 2s ease-out" : "none",
            }}
          />
          {/* Segmento feminino */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="10"
            strokeDasharray={`${femininoStroke} ${circumference}`}
            strokeDashoffset={-masculinoStroke}
            className="transition-all duration-2000 ease-out"
            style={{
              strokeDasharray: `${femininoStroke} ${circumference}`,
              strokeDashoffset: -masculinoStroke,
              animation: isVisible ? "drawCircle 2s ease-out 0.5s both" : "none",
            }}
          />
        </svg>

        {/* Ícones no centro */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
          style={{ transitionDelay: "1s" }}
        >
          <div className="flex items-center space-x-1 text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
            {/* Ícone masculino */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="transition-transform duration-300 hover:scale-110"
            >
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 9.55 14.55 10 14 10C13.45 10 13 9.55 13 9V7H11V9C11 9.55 10.55 10 10 10C9.45 10 9 9.55 9 9V7H3V9C3 10.1 3.9 11 5 11V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V11C20.1 11 21 10.1 21 9Z" />
            </svg>

            <div className="w-px h-6 bg-gray-400"></div>

            {/* Ícone feminino */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="transition-transform duration-300 hover:scale-110"
            >
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM7 22H9V20H15V22H17V20C17 19.45 16.55 19 16 19H15V11C15 9.9 14.1 9 13 9H11C9.9 9 9 9.9 9 11V19H8C7.45 19 7 19.45 7 20V22Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div
        className={`mt-4 flex justify-center space-x-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{ transitionDelay: "1.5s" }}
      >
        <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div className="w-3 h-3 bg-cyan-500 rounded transition-all duration-300 hover:scale-125"></div>
          <span className="text-xs">Feminino</span>
          <span className="text-xs font-bold">{feminino}%</span>
        </div>
        <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div className="w-3 h-3 bg-cyan-600 rounded transition-all duration-300 hover:scale-125"></div>
          <span className="text-xs">Masculino</span>
          <span className="text-xs font-bold">{masculino}%</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes drawCircle {
          from {
            stroke-dasharray: 0 ${circumference};
          }
          to {
            stroke-dasharray: var(--final-dash-array) ${circumference};
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
