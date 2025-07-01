"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { AuthService, type AuthState } from "@/lib/auth"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase" // Import supabase client

// Definir a interface para o perfil do usuário
export interface UserProfile {
  id: string // user_id
  empresa_id: string
  role: string
  // Adicione outros campos do perfil se necessário
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>
  loading: boolean
  profile: UserProfile | null // Adicionar perfil ao contexto
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  })
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const authService = AuthService.getInstance()

  // Função para buscar o perfil do usuário
  const fetchProfile = async (user: User | null) => {
    if (!user) {
      setProfile(null)
      return null
    }
    try {
      const { data, error } = await supabase.from("profiles").select("empresa_id, role").eq("id", user.id).single()

      if (error) {
        console.error("Erro ao buscar perfil do usuário:", error)
        // Se o perfil não for encontrado, pode ser um estado transitório após o cadastro
        // O trigger do banco de dados deve criar o perfil.
        // Vamos deslogar para evitar um estado inconsistente.
        if (error.code === "PGRST116") {
          // "Not a single row was returned"
          console.warn("Perfil não encontrado, deslogando usuário.")
          await authService.logout()
        }
        return null
      }

      const userProfile: UserProfile = { id: user.id, ...data }
      setProfile(userProfile)
      return userProfile
    } catch (e) {
      console.error("Exceção ao buscar perfil:", e)
      setProfile(null)
      return null
    }
  }

  useEffect(() => {
    const checkInitialSession = async () => {
      setLoading(true)
      const { user } = await authService.checkSession()
      setAuthState({ isAuthenticated: !!user, user })
      if (user) {
        await fetchProfile(user)
      }
      setLoading(false)
    }

    checkInitialSession()

    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null
      setAuthState({ isAuthenticated: !!user, user })
      if (user) {
        await fetchProfile(user)
      } else {
        setProfile(null)
      }
      if (event === "INITIAL_SESSION") {
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password)
    if (result.success && result.user) {
      setAuthState({ isAuthenticated: true, user: result.user })
      await fetchProfile(result.user) // Buscar perfil após login
    }
    return result
  }

  const loginWithGoogle = async () => {
    return await authService.loginWithGoogle()
  }

  const register = async (email: string, password: string, userData?: any) => {
    // O trigger no Supabase cuidará da criação do perfil e da empresa
    return await authService.register(email, password, userData)
  }

  const logout = async () => {
    await authService.logout()
    setAuthState({ isAuthenticated: false, user: null })
    setProfile(null) // Limpar perfil no logout
  }

  const requestPasswordReset = async (email: string) => {
    return await authService.requestPasswordReset(email)
  }

  const resetPassword = async (newPassword: string) => {
    return await authService.resetPassword(newPassword)
  }

  const value: AuthContextType = {
    ...authState,
    profile,
    login,
    loginWithGoogle,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
