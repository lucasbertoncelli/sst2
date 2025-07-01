"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Building } from "lucide-react"
import type { Empresa } from "@/types"

interface ModeloFichaData {
  cabecalhoTitulo: string
  cabecalhoTexto: string
  cabecalhoLegislacao: string
}

interface ModeloFichaEPIProps {
  onSave: (data: ModeloFichaData) => void
  onCancel: () => void
  initialData?: Partial<ModeloFichaData>
}

export function ModeloFichaEPI({ onSave, onCancel, initialData }: ModeloFichaEPIProps) {
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [formData, setFormData] = useState<ModeloFichaData>({
    cabecalhoTitulo:
      initialData?.cabecalhoTitulo || "Ficha de Controle de Entrega de Equipamento de Proteção Individual",
    cabecalhoTexto:
      initialData?.cabecalhoTexto ||
      "Declaro para todos os efeitos legais que recebi os equipamentos de proteção individual (EPI) relacionados abaixo, bem como as instruções para sua correta utilização, obrigando-me:\n\n" +
        "1) usar o EPI e uniforme indicado, apenas às finalidades a que se destina;\n" +
        "2) comunicar ao setor responsável, qualquer alteração no EPI que o torne parcialmente ou totalmente danificado;\n" +
        "3) responsabilizar-me pelos danos do EPI, quando usado de modo inadequado ou fora das atividades a que se destina, bem como pelo seu extravio;\n" +
        "4) devolvê-lo quando da troca por outro ou no meu desligamento da empresa.",
    cabecalhoLegislacao:
      initialData?.cabecalhoLegislacao ||
      "Consolidação das leis do Trabalho (CLT) - Capítulo V - Seção I - Art. 158b, c/c Norma Regulamentadora (NR) - NR-1 e NR-6, alínea 6.7, disciplinadas pela Portaria MTB. nº 3.214/78 e artigo 191, itens I e II da CLT e simula n. 80 do TST.",
  })

  // Carregar dados da empresa
  useEffect(() => {
    const empresaData = localStorage.getItem("empresa")
    if (empresaData) {
      try {
        setEmpresa(JSON.parse(empresaData))
      } catch (error) {
        console.error("Erro ao carregar dados da empresa:", error)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  // Gerar texto do rodapé da empresa
  const getRodapeEmpresa = () => {
    if (!empresa) return "Informações da empresa aparecerão aqui após o cadastro"

    let rodapeTexto = empresa.razaoSocial || empresa.nomeFantasia || ""

    // Adicionar endereço se disponível
    if (empresa.enderecoCompleto || (empresa.cidade && empresa.estado)) {
      const endereco =
        empresa.enderecoCompleto ||
        `${empresa.cidade || ""}, ${empresa.estado || ""}${empresa.cep ? ` - CEP: ${empresa.cep}` : ""}`
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

    return rodapeTexto
  }

  // Formatar data atual
  const getDataAtual = () => {
    const data = new Date()
    return `${data.toLocaleDateString()} às ${data.toLocaleTimeString()}`
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header - Editável */}
      <Card>
        <CardHeader className="text-center border-b">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cabecalhoTitulo">Título do Cabeçalho</Label>
              <Input
                id="cabecalhoTitulo"
                value={formData.cabecalhoTitulo}
                onChange={(e) => setFormData({ ...formData, cabecalhoTitulo: e.target.value })}
                className="text-center font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cabecalhoTexto">Texto de Declaração</Label>
              <Textarea
                id="cabecalhoTexto"
                value={formData.cabecalhoTexto}
                onChange={(e) => setFormData({ ...formData, cabecalhoTexto: e.target.value })}
                rows={8}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cabecalhoLegislacao">Referência Legal</Label>
              <Textarea
                id="cabecalhoLegislacao"
                value={formData.cabecalhoLegislacao}
                onChange={(e) => setFormData({ ...formData, cabecalhoLegislacao: e.target.value })}
                rows={2}
                className="text-xs"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Visualização do Modelo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visualização do Modelo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-6 space-y-6 min-h-[700px] relative">
              {/* Cabeçalho da empresa (se existir) */}
              {empresa && (
                <div className="text-center border-b pb-4">
                  <h1 className="font-bold text-lg">{empresa.razaoSocial || empresa.nomeFantasia}</h1>
                  {empresa.nomeFantasia && empresa.razaoSocial !== empresa.nomeFantasia && (
                    <p className="text-sm text-gray-600">({empresa.nomeFantasia})</p>
                  )}
                </div>
              )}

              {/* Cabeçalho do documento */}
              <div className="text-center space-y-4">
                <h2 className="font-bold">{formData.cabecalhoTitulo}</h2>
                <div className="text-sm whitespace-pre-line">{formData.cabecalhoTexto}</div>
                <div className="text-xs italic">{formData.cabecalhoLegislacao}</div>
              </div>

              {/* Dados do Funcionário (Placeholder) */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-2">Dados do Funcionário</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nome:</p>
                    <p className="text-sm">[Nome do Funcionário]</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Cargo:</p>
                    <p className="text-sm">[Cargo]</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Departamento:</p>
                    <p className="text-sm">[Departamento]</p>
                  </div>
                </div>
              </div>

              {/* EPIs (Placeholder) */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-2">Relação de EPIs</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">#</th>
                      <th className="text-left py-2">Descrição</th>
                      <th className="text-left py-2">CA</th>
                      <th className="text-left py-2">Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">1</td>
                      <td className="py-2">[Descrição do EPI]</td>
                      <td className="py-2">[Número CA]</td>
                      <td className="py-2">[Qtd]</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Datas (Placeholder) */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-2">Informações Adicionais</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Data de Entrega:</p>
                    <p className="text-sm">[Data]</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Validade:</p>
                    <p className="text-sm">[Data]</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fabricação:</p>
                    <p className="text-sm">[Data]</p>
                  </div>
                </div>
              </div>

              {/* Assinaturas */}
              <div className="border-t pt-4 mt-8">
                <div className="grid grid-cols-2 gap-8 mt-12">
                  <div className="text-center">
                    <div className="border-t border-black pt-2">
                      <p className="text-sm">Assinatura do Funcionário</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-black pt-2">
                      <p className="text-sm">Assinatura do Responsável pela Entrega</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Espaço adicional para empurrar o rodapé para baixo */}
              <div className="h-20"></div>

              {/* Rodapé com informações da empresa - AGORA MAIS PARA BAIXO */}
              <div className="absolute bottom-4 left-6 right-6 border-t pt-2">
                <div className="flex items-center justify-center gap-2">
                  {/* Logo da empresa em miniatura */}
                  {empresa && (empresa.logoBase64 || empresa.logoUrl) ? (
                    <div className="w-8 h-8 flex-shrink-0">
                      <img
                        src={empresa.logoBase64 || empresa.logoUrl}
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <Building className="w-6 h-6 text-gray-400" />
                  )}
                  <div className="text-xs text-gray-600">{getRodapeEmpresa()}</div>
                </div>
                <div className="text-xs text-gray-500 text-center mt-1">Documento gerado em: {getDataAtual()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            Salvar Modelo
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
