"use client"

import type React from "react"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Sidebar } from "@/components/sidebar"

// Rotas que não exigem autenticação
const publicPaths = ["/login", "/cadastro", "/recuperar-senha", "/redefinir-senha", "/auth/callback"]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Aguarda o fim do carregamento da autenticação
    if (loading) {
      return
    }

    const pathIsPublic = publicPaths.some((path) => pathname.startsWith(path))

    // Se não está autenticado e tenta acessar uma página privada, redireciona para o login
    if (!isAuthenticated && !pathIsPublic) {
      router.push("/login")
    }

    // Se está autenticado e tenta acessar uma página pública (como /login), redireciona para o painel
    if (isAuthenticated && pathIsPublic) {
      router.push("/")
    }
  }, [isAuthenticated, loading, pathname, router])

  // Exibe um spinner de carregamento enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-primary" />
          <p className="mt-4 text-gray-600">Carregando sistema...</p>
        </div>
      </div>
    )
  }

  const pathIsPublic = publicPaths.some((path) => pathname.startsWith(path))

  // Se a rota é pública e o usuário não está logado, exibe a página (ex: Login, Cadastro)
  if (!isAuthenticated && pathIsPublic) {
    return <>{children}</>
  }

  // Se o usuário está autenticado e a rota é privada, exibe o layout principal com o menu
  if (isAuthenticated && !pathIsPublic) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto md:ml-64">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    )
  }

  // Estado de transição antes do redirecionamento
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-primary" />
        <p className="mt-4 text-gray-600">Verificando rota...</p>
      </div>
    </div>
  )
}
