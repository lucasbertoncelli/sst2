// Script para testar o formulário de cadastro automaticamente
console.log("🧪 Iniciando teste do formulário de cadastro...")

// Dados de teste
const dadosTeste = {
  nome: "João Silva Teste",
  email: `teste${Date.now()}@exemplo.com`, // Email único
  senha: "123456789",
  confirmarSenha: "123456789",
}

// Função para preencher campo
function preencherCampo(seletor, valor) {
  const campo = document.querySelector(seletor)
  if (campo) {
    campo.value = valor
    campo.dispatchEvent(new Event("input", { bubbles: true }))
    campo.dispatchEvent(new Event("change", { bubbles: true }))
    console.log(`✅ Campo ${seletor} preenchido com: ${valor}`)
  } else {
    console.error(`❌ Campo ${seletor} não encontrado`)
  }
}

// Função para clicar no botão
function clicarBotao(seletor) {
  const botao = document.querySelector(seletor)
  if (botao && !botao.disabled) {
    botao.click()
    console.log(`✅ Botão ${seletor} clicado`)
  } else {
    console.error(`❌ Botão ${seletor} não encontrado ou desabilitado`)
  }
}

// Executar teste
setTimeout(() => {
  console.log("📝 Preenchendo formulário...")

  preencherCampo('input[name="nome"]', dadosTeste.nome)
  preencherCampo('input[name="email"]', dadosTeste.email)
  preencherCampo('input[name="senha"]', dadosTeste.senha)
  preencherCampo('input[name="confirmarSenha"]', dadosTeste.confirmarSenha)

  setTimeout(() => {
    console.log("🚀 Enviando formulário...")
    clicarBotao('button[type="submit"]')

    // Monitorar resultado
    setTimeout(() => {
      const erro = document.querySelector('[role="alert"]')
      const sucesso = document.querySelector(".bg-green-50")

      if (sucesso) {
        console.log("🎉 Cadastro realizado com sucesso!")
      } else if (erro) {
        console.log("⚠️ Erro no cadastro:", erro.textContent)
      } else {
        console.log("⏳ Aguardando resposta...")
      }
    }, 2000)
  }, 1000)
}, 500)
