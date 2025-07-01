import { supabase } from "./supabase"
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js"

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
}

export class AuthService {
  private static instance: AuthService
  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(email: string, password: string) {
    console.log("AuthService: Tentando login com", email)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error("AuthService: Erro no login:", error.message)
      return { success: false, error: error.message }
    }
    console.log("AuthService: Login bem-sucedido para", data.user?.email)
    return { success: true, user: data.user }
  }

  async register(email: string, password: string, userData?: any) {
    console.log("AuthService: Tentando registrar", email)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: userData },
    })
    if (error) {
      console.error("AuthService: Erro no registro:", error.message)
      return { success: false, error: error.message }
    }
    console.log("AuthService: Registro bem-sucedido para", data.user?.email)
    return { success: true, user: data.user }
  }

  async logout() {
    console.log("AuthService: Fazendo logout")
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("AuthService: Erro no logout:", error.message)
    }
  }

  async checkSession(): Promise<AuthState> {
    console.log("AuthService: Verificando sessão")
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error("AuthService: Erro ao obter sessão:", error.message)
      return { isAuthenticated: false, user: null }
    }
    const user = data.session?.user ?? null
    console.log("AuthService: Sessão verificada. Usuário:", user?.email || "Nenhum")
    return { isAuthenticated: !!user, user }
  }

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }

  // Funções de recuperação de senha
  async requestPasswordReset(email: string) {
    console.log("AuthService: Solicitando recuperação de senha para", email)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })
    if (error) {
      console.error("AuthService: Erro na solicitação de recuperação:", error.message)
      return { success: false, error: error.message }
    }
    return { success: true }
  }

  async resetPassword(newPassword: string) {
    console.log("AuthService: Redefinindo senha")
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      console.error("AuthService: Erro ao redefinir senha:", error.message)
      return { success: false, error: error.message }
    }
    return { success: true, user: data.user }
  }

  async loginWithGoogle() {
    console.log("AuthService: Tentando login com Google")
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error("AuthService: Erro no login com Google:", error.message)
      return { success: false, error: error.message }
    }
    return { success: true }
  }
}
