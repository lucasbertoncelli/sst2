"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Erro no callback:", error)
          setStatus("error")
          setMessage("Erro na autenticação. Tente novamente.")
          setTimeout(() => {
            router.push("/login?error=callback_error")
          }, 3000)
          return
        }

        if (data.session) {
          setStatus("success")
          setMessage("Login realizado com sucesso! Redirecionando...")
          setTimeout(() => {
            router.push("/")
          }, 2000)
        } else {
          setStatus("error")
          setMessage("Sessão não encontrada. Redirecionando para login...")
          setTimeout(() => {
            router.push("/login")
          }, 3000)
        }
      } catch (error) {
        console.error("Erro no callback:", error)
        setStatus("error")
        setMessage("Erro interno. Redirecionando para login...")
        setTimeout(() => {
          router.push("/login?error=callback_error")
        }, 3000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <img src="/images/logo-domine-sst.png" alt="Domine SST" className="h-16 w-auto object-contain" />
        </div>

        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-gray-600">Processando autenticação...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-green-600">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm text-red-600">{message}</p>
          </>
        )}
      </div>
    </div>
  )
}
