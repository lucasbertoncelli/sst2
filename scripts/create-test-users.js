// Script para criar usuários de teste no Supabase
// Execute este script no console do navegador na página do Supabase

const createTestUsers = async () => {
  const supabaseUrl = "SUA_SUPABASE_URL"
  const supabaseServiceKey = "SUA_SERVICE_ROLE_KEY" // Use a Service Role Key, não a anon key

  const users = [
    {
      email: "admin@empresa.com",
      password: "admin123",
      user_metadata: {
        full_name: "Administrador",
        role: "admin",
      },
    },
    {
      email: "rh@empresa.com",
      password: "rh123",
      user_metadata: {
        full_name: "RH Manager",
        role: "rh",
      },
    },
    {
      email: "sst@empresa.com",
      password: "sst123",
      user_metadata: {
        full_name: "SST Manager",
        role: "sst",
      },
    },
    {
      email: "viewer@empresa.com",
      password: "viewer123",
      user_metadata: {
        full_name: "Visualizador",
        role: "viewer",
      },
    },
  ]

  for (const user of users) {
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseServiceKey}`,
          apikey: supabaseServiceKey,
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          user_metadata: user.user_metadata,
          email_confirm: true, // Confirma o email automaticamente
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`✅ Usuário ${user.email} criado com sucesso:`, result)
      } else {
        const error = await response.json()
        console.error(`❌ Erro ao criar usuário ${user.email}:`, error)
      }
    } catch (error) {
      console.error(`❌ Erro ao criar usuário ${user.email}:`, error)
    }
  }
}

// Execute a função
createTestUsers()

console.log(`
📋 INSTRUÇÕES:

1. Substitua 'SUA_SUPABASE_URL' pela URL do seu projeto
2. Substitua 'SUA_SERVICE_ROLE_KEY' pela Service Role Key (não a anon key)
3. Execute este script no console do navegador
4. Os usuários serão criados no Supabase Auth
5. Teste o login com as credenciais criadas

🔑 CREDENCIAIS DE TESTE:
- admin@empresa.com / admin123
- rh@empresa.com / rh123  
- sst@empresa.com / sst123
- viewer@empresa.com / viewer123
`)
