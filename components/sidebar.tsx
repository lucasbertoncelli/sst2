"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { LogoutConfirmationModal } from "@/components/logout-confirmation-modal"
import {
  LayoutDashboard,
  GraduationCap,
  UserX,
  Shield,
  MessageSquare,
  AlertTriangle,
  Users,
  LogOut,
  UserCheck,
  Building,
  Repeat,
  ChevronDown,
  Package,
  Truck,
  ListChecks,
  UserPlus,
  FileText,
  Menu,
  X,
} from "lucide-react"

interface NavigationItem {
  name: string
  href?: string
  icon: React.ElementType
  items?: NavigationSubItem[]
}

interface NavigationSubItem {
  name: string
  href: string
  icon: React.ElementType
}

const navigation: NavigationItem[] = [
  { name: "Painel", href: "/", icon: LayoutDashboard },
  {
    name: "Treinamentos",
    icon: GraduationCap,
    items: [{ name: "Lista de Treinamentos", href: "/treinamentos", icon: ListChecks }],
  },
  { name: "Absenteísmo", href: "/absenteismo", icon: UserX },
  {
    name: "Lançamentos",
    icon: Repeat,
    items: [
      { name: "Acidentes e Incidentes", href: "/lancamentos/acidentes", icon: AlertTriangle },
      { name: "Detalhes dos Treinamentos", href: "/lancamentos/treinamentos/detalhes", icon: FileText },
      { name: "Entrega de EPIs", href: "/lancamentos/epis", icon: Shield },
      { name: "Treinamentos", href: "/lancamentos/treinamentos", icon: ListChecks },
    ],
  },
  { name: "Estoque de EPIs", href: "/epis/controle", icon: Package },
  {
    name: "Fornecedores",
    icon: Truck,
    items: [
      { name: "Cadastro Completo", href: "/fornecedores/cadastro", icon: FileText },
      { name: "Lista de Fornecedores", href: "/fornecedores", icon: Truck },
    ],
  },
  { name: "DDS", href: "/dds", icon: MessageSquare },
  { name: "Acidentes", href: "/acidentes", icon: AlertTriangle },
  {
    name: "Funcionários",
    icon: UserCheck,
    items: [
      { name: "Cadastro Completo", href: "/funcionarios/cadastro", icon: UserPlus },
      { name: "Lista de Funcionários", href: "/funcionarios", icon: Users },
    ],
  },
  { name: "Setores e Turnos", href: "/setores", icon: Building },
  { name: "Usuários", href: "/usuarios", icon: Users },
  { name: "Empresa", href: "/empresa", icon: Building },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    // Expandir automaticamente o menu Lançamentos se estiver em uma de suas subpáginas
    Lançamentos: pathname.startsWith("/lancamentos"),
    // Expandir automaticamente o menu Funcionários se estiver em uma de suas subpáginas
    Funcionários: pathname.startsWith("/funcionarios"),
    // Expandir automaticamente o menu Fornecedores se estiver em uma de suas subpáginas
    Fornecedores: pathname.startsWith("/fornecedores"),
    // Expandir automaticamente o menu Treinamentos se estiver em uma de suas subpáginas
    Treinamentos: pathname.startsWith("/treinamentos"),
  })

  // Fechar menu mobile quando mudar de página
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true)
  }

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false)
    logout()
  }

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false)
  }

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

  return (
    <>
      {/* Botão de menu mobile */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 rounded-md bg-[#0B0E13] p-2 text-white md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        <span className="sr-only">Abrir menu</span>
      </button>

      {/* Overlay para fechar o menu em dispositivos móveis */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 transform transition-transform duration-300 ease-in-out",
          "bg-[#0B0E13]",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-24 items-center justify-center border-b border-gray-800 px-2 py-3">
          <img src="/images/logo-domine-sst.png" alt="Domine SST" className="h-auto w-[85%] max-h-16 object-contain" />
        </div>

        <div className="flex flex-col h-[calc(100vh-6rem)]">
          <nav className="flex-1 px-4 py-4 overflow-y-auto scrollbar-hide">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  {item.items ? (
                    <div>
                      <button
                        onClick={() => toggleExpand(item.name)}
                        className={cn(
                          "w-full text-left flex items-center justify-between gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                          pathname.startsWith(item.href || `/${item.name.toLowerCase()}`)
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-800",
                        )}
                      >
                        <div className="flex items-center gap-x-3">
                          <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                          {item.name}
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 shrink-0 transition-transform",
                            expandedItems[item.name] ? "rotate-180" : "",
                          )}
                        />
                      </button>
                      {expandedItems[item.name] && (
                        <ul className="mt-1 pl-6 space-y-1">
                          {item.items.map((subItem) => (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.href}
                                className={cn(
                                  "flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium",
                                  pathname === subItem.href
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                                )}
                              >
                                <subItem.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className={cn(
                        pathname === item.href
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:text-white hover:bg-gray-800",
                        "flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-gray-800 p-4">
            {user && <div className="px-2 py-1 text-xs text-gray-400 mb-2">Logado como: {user.email}</div>}
            <button
              onClick={handleLogoutClick}
              className="flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmação de logout */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </>
  )
}
