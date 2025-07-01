import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { AuthGuard } from "@/components/auth-guard"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Domine SST",
  description: "Sistema de Gestão de Segurança e Saúde do Trabalho",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
      </body>
    </html>
  )
}
