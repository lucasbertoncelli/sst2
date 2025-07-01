import jsPDF from "jspdf"
import type { EntregaEPI } from "@/types"

interface ModeloFicha {
  cabecalhoTitulo: string
  cabecalhoTexto: string
  cabecalhoLegislacao: string
}

export function generateEntregaEPIPDF(entrega: EntregaEPI, modeloFicha: ModeloFicha) {
  console.log("=== DEBUG PDF GENERATOR ===")
  console.log("Modelo recebido:", modeloFicha)
  console.log("Entrega recebida:", entrega)

  const doc = new jsPDF()

  // Carregar dados da empresa do localStorage
  const empresaData = localStorage.getItem("empresa")
  let empresa = null
  if (empresaData) {
    try {
      empresa = JSON.parse(empresaData)
      console.log("Empresa carregada:", empresa)
    } catch (error) {
      console.error("Erro ao carregar dados da empresa:", error)
    }
  }

  // Carregar modelo de ficha do localStorage
  const modeloFichaData = localStorage.getItem("modeloFichaEPI")
  let modeloFichaLocal = null
  if (modeloFichaData) {
    try {
      modeloFichaLocal = JSON.parse(modeloFichaData)
      console.log("Modelo de ficha carregado do localStorage:", modeloFichaLocal)
      // Usar o modelo do localStorage se disponível
      if (modeloFichaLocal) {
        modeloFicha = modeloFichaLocal
      }
    } catch (error) {
      console.error("Erro ao carregar modelo de ficha:", error)
    }
  }

  // Verificar se o modelo tem os dados corretos
  if (!modeloFicha || !modeloFicha.cabecalhoTitulo) {
    console.error("Modelo de ficha inválido ou não encontrado!")
    // Usar modelo padrão como fallback
    modeloFicha = {
      cabecalhoTitulo: "Ficha de Controle de Entrega de Equipamento de Proteção Individual",
      cabecalhoTexto:
        "Declaro para todos os efeitos legais que recebi os equipamentos de proteção individual (EPI) relacionados abaixo...",
      cabecalhoLegislacao: "Consolidação das leis do Trabalho (CLT) - Capítulo V - Seção I - Art. 158b...",
    }
  }

  console.log("Modelo final sendo usado:", modeloFicha)

  // Configurações
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const lineHeight = 6
  let currentY = margin

  // Função para adicionar texto com quebra de linha
  const addText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize = 10,
    align: "left" | "center" = "left",
  ) => {
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, maxWidth)

    if (align === "center") {
      lines.forEach((line: string, index: number) => {
        const textWidth = doc.getTextWidth(line)
        const centerX = x + (maxWidth - textWidth) / 2
        doc.text(line, centerX, y + index * lineHeight)
      })
    } else {
      doc.text(lines, x, y)
    }

    return y + lines.length * lineHeight
  }

  // Função para adicionar linha horizontal
  const addLine = (y: number, startX = margin, endX = pageWidth - margin) => {
    doc.line(startX, y, endX, y)
    return y + 8
  }

  // Cabeçalho da empresa (se existir)
  if (empresa) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    currentY = addText(
      empresa.razaoSocial || empresa.nomeFantasia || "",
      margin,
      currentY,
      pageWidth - 2 * margin,
      14,
      "center",
    )

    if (empresa.nomeFantasia && empresa.razaoSocial !== empresa.nomeFantasia) {
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      currentY = addText(`(${empresa.nomeFantasia})`, margin, currentY, pageWidth - 2 * margin, 12, "center")
    }
    currentY += 10
  }

  // Título do documento usando o modelo configurado
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  currentY = addText(modeloFicha.cabecalhoTitulo, margin, currentY, pageWidth - 2 * margin, 16, "center")
  currentY += 15

  // Linha separadora
  currentY = addLine(currentY)

  // Texto de declaração usando o modelo configurado
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  currentY = addText(modeloFicha.cabecalhoTexto, margin, currentY, pageWidth - 2 * margin, 10)
  currentY += 10

  // Referência legal usando o modelo configurado
  doc.setFontSize(8)
  doc.setFont("helvetica", "italic")
  currentY = addText(`Conforme: ${modeloFicha.cabecalhoLegislacao}`, margin, currentY, pageWidth - 2 * margin, 8)
  currentY += 15

  // Linha separadora
  currentY = addLine(currentY)

  // Dados do Funcionário
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  currentY = addText("Dados do Funcionário", margin, currentY, pageWidth - 2 * margin, 14)
  currentY += 8

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  currentY = addText(`Nome: ${entrega.funcionario?.nome || "N/A"}`, margin, currentY, pageWidth - 2 * margin, 11)
  currentY += 2
  currentY = addText(`Cargo: ${entrega.funcionario?.cargo || "N/A"}`, margin, currentY, pageWidth - 2 * margin, 11)
  currentY += 2
  currentY = addText(`Setor: ${entrega.funcionario?.setor || "N/A"}`, margin, currentY, pageWidth - 2 * margin, 11)
  currentY += 15

  // Linha separadora
  currentY = addLine(currentY)

  // Relação de EPIs
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  currentY = addText(
    "Relação de Equipamentos de Proteção Individual entregues",
    margin,
    currentY,
    pageWidth - 2 * margin,
    14,
  )
  currentY += 15

  // Cabeçalho da tabela
  const tableStartY = currentY
  const colWidths = [15, 80, 30, 30, 35]
  const colPositions = [margin, margin + 15, margin + 95, margin + 125, margin + 155]

  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("#", colPositions[0], currentY)
  doc.text("Descrição do EPI", colPositions[1], currentY)
  doc.text("CA", colPositions[2], currentY)
  doc.text("Quantidade", colPositions[3], currentY)
  doc.text("Validade", colPositions[4], currentY)
  currentY += 8

  // Linha da tabela
  doc.line(margin, currentY, pageWidth - margin, currentY)
  currentY += 8

  // Dados do EPI
  doc.setFont("helvetica", "normal")
  doc.text("1", colPositions[0], currentY)

  // Quebrar texto longo do EPI se necessário
  const epiNome = entrega.epi?.nome || "N/A"
  if (epiNome.length > 35) {
    const epiLines = doc.splitTextToSize(epiNome, 75)
    doc.text(epiLines, colPositions[1], currentY)
    currentY += (epiLines.length - 1) * lineHeight
  } else {
    doc.text(epiNome, colPositions[1], currentY)
  }

  doc.text(entrega.ca || "N/A", colPositions[2], currentY)
  doc.text("1", colPositions[3], currentY)
  doc.text(entrega.validade ? new Date(entrega.validade).toLocaleDateString("pt-BR") : "N/A", colPositions[4], currentY)
  currentY += 15

  // Linha separadora
  currentY = addLine(currentY)

  // Outras informações
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  currentY = addText("Outras Informações", margin, currentY, pageWidth - 2 * margin, 14)
  currentY += 8

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  currentY = addText(
    `Data de Entrega: ${entrega.dataEntrega ? new Date(entrega.dataEntrega).toLocaleDateString("pt-BR") : "N/A"}`,
    margin,
    currentY,
    pageWidth - 2 * margin,
    11,
  )
  currentY += 2

  if (entrega.dataFabricacao) {
    currentY = addText(
      `Data de Fabricação: ${new Date(entrega.dataFabricacao).toLocaleDateString("pt-BR")}`,
      margin,
      currentY,
      pageWidth - 2 * margin,
      11,
    )
    currentY += 2
  }

  currentY += 25

  // Linha separadora para assinaturas
  currentY = addLine(currentY)

  // Assinaturas
  const assinaturaY = currentY + 30
  const assinaturaWidth = 70
  const leftSignX = margin + 20
  const rightSignX = pageWidth - margin - assinaturaWidth - 20

  // Linhas para assinatura
  doc.line(leftSignX, assinaturaY, leftSignX + assinaturaWidth, assinaturaY)
  doc.line(rightSignX, assinaturaY, rightSignX + assinaturaWidth, assinaturaY)

  // Textos das assinaturas
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")

  // Centralizar texto sob a linha de assinatura
  const leftText = "Assinatura do Funcionário"
  const rightText = "Assinatura do Responsável"
  const leftTextWidth = doc.getTextWidth(leftText)
  const rightTextWidth = doc.getTextWidth(rightText)

  doc.text(leftText, leftSignX + (assinaturaWidth - leftTextWidth) / 2, assinaturaY + 8)
  doc.text(rightText, rightSignX + (assinaturaWidth - rightTextWidth) / 2, assinaturaY + 8)

  // Nomes sob as assinaturas
  doc.setFontSize(9)
  const funcionarioNome = entrega.funcionario?.nome || ""
  const responsavelNome = "Técnico de Segurança"
  const funcionarioWidth = doc.getTextWidth(funcionarioNome)
  const responsavelWidth = doc.getTextWidth(responsavelNome)

  doc.text(funcionarioNome, leftSignX + (assinaturaWidth - funcionarioWidth) / 2, assinaturaY + 18)
  doc.text(responsavelNome, rightSignX + (assinaturaWidth - responsavelWidth) / 2, assinaturaY + 18)

  // Rodapé com informações da empresa - POSICIONADO MAIS PARA BAIXO
  const rodapeY = pageHeight - 15

  // Adicionar logo da empresa em miniatura no rodapé
  if (empresa && (empresa.logoBase64 || empresa.logoUrl)) {
    try {
      const logoSrc = empresa.logoBase64 || empresa.logoUrl
      const logoWidth = 10
      const logoHeight = 10
      const logoX = margin
      const logoY = rodapeY - 10

      // Adicionar a imagem
      doc.addImage(logoSrc, "JPEG", logoX, logoY, logoWidth, logoHeight)

      // Ajustar a posição X para o texto da empresa (após a logo)
      const textoX = logoX + logoWidth + 5

      // Adicionar informações da empresa
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")

      if (empresa) {
        let rodapeTexto = empresa.razaoSocial || empresa.nomeFantasia || ""

        // Adicionar endereço se disponível
        if (empresa.enderecoCompleto || (empresa.cidade && empresa.estado)) {
          const endereco =
            empresa.enderecoCompleto ||
            `${empresa.rua || ""} ${empresa.numero || ""}, ${empresa.bairro || ""}, ${empresa.cidade || ""} - ${empresa.estado || ""}${empresa.cep ? ` - CEP: ${empresa.cep}` : ""}`
          rodapeTexto += ` - ${endereco}`
        }

        // Adicionar telefone se disponível
        if (empresa.telefone) {
          rodapeTexto += ` - Tel: ${empresa.telefone}`
        }

        // Adicionar email se disponível
        if (empresa.email) {
          rodapeTexto += ` - ${empresa.email}`
        }

        // Texto após a logo
        doc.text(rodapeTexto, textoX, rodapeY)
      }
    } catch (error) {
      console.error("Erro ao adicionar logo no rodapé:", error)

      // Se falhar ao adicionar a logo, adicionar apenas o texto centralizado
      adicionarRodapeTexto()
    }
  } else {
    // Se não houver logo, adicionar apenas o texto centralizado
    adicionarRodapeTexto()
  }

  // Função para adicionar apenas o texto do rodapé centralizado
  function adicionarRodapeTexto() {
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")

    if (empresa) {
      let rodapeTexto = empresa.razaoSocial || empresa.nomeFantasia || ""

      // Adicionar endereço se disponível
      if (empresa.enderecoCompleto || (empresa.cidade && empresa.estado)) {
        const endereco =
          empresa.enderecoCompleto ||
          `${empresa.rua || ""} ${empresa.numero || ""}, ${empresa.bairro || ""}, ${empresa.cidade || ""} - ${empresa.estado || ""}${empresa.cep ? ` - CEP: ${empresa.cep}` : ""}`
        rodapeTexto += ` - ${endereco}`
      }

      // Adicionar telefone se disponível
      if (empresa.telefone) {
        rodapeTexto += ` - Tel: ${empresa.telefone}`
      }

      // Adicionar email se disponível
      if (empresa.email) {
        rodapeTexto += ` - ${empresa.email}`
      }

      // Centralizar o rodapé
      const rodapeWidth = doc.getTextWidth(rodapeTexto)
      const rodapeX = (pageWidth - rodapeWidth) / 2
      doc.text(rodapeTexto, rodapeX, rodapeY)
    }
  }

  // Data de geração
  doc.setFontSize(8)
  doc.setFont("helvetica", "italic")
  const dataTexto = `Documento gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`
  const dataWidth = doc.getTextWidth(dataTexto)
  const dataX = (pageWidth - dataWidth) / 2
  doc.text(dataTexto, dataX, pageHeight - 5)

  // Gerar e baixar o PDF
  const fileName = `Ficha_EPI_${entrega.funcionario?.nome?.replace(/\s+/g, "_") || "Funcionario"}_${new Date().toISOString().split("T")[0]}.pdf`
  doc.save(fileName)
}
