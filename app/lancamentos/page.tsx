"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LancamentosPage() {
  const router = useRouter()

  // Redirecionar para a página de lançamentos de EPIs por padrão
  useEffect(() => {
    router.push("/lancamentos/epis")
  }, [router])

  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Redirecionando...</p>
      </div>
    </div>
  )
}
