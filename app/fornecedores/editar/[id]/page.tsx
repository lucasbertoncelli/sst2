"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataForm } from "@/components/data-form"
import { mockFornecedores } from "@/lib/mock-data"
import { ArrowLeft, CheckCircle } from "lucide-react"
import type { Fornecedor } from "@/types"

export default function EditarFornecedorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const [activeTab, setActiveTab] = useState("informacoes-basicas")
  const [formData, setFormData] = useState<Partial<Fornecedor>>({})
  const [formKey, setFormKey] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null)

  useEffect(() => {
    // Find the fornecedor by ID
    const found = mockFornecedores.find((f) => f.id === id)
    if (found) {
      setFornecedor(found)
      setFormData(found)
    } else {
      alert("Fornecedor não encontrado!")
      router.push("/fornecedores")
    }
  }, [id, router])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleNext = (data: Partial<Fornecedor>) => {
    // Merge the new data with existing formData
    const updatedData = { ...formData, ...data }
    setFormData(updatedData)

    // Move to the next tab
    if (activeTab === "informacoes-basicas") {
      setActiveTab("contato-localizacao")
    } else if (activeTab === "contato-localizacao") {
      setActiveTab("informacoes-operacionais")
    } else if (activeTab === "informacoes-operacionais") {
      setActiveTab("documentos-compliance")
    }

    // Increment the form key to force re-render
    setFormKey((prev) => prev + 1)
  }

  const handlePrevious = () => {
    // Move to the previous tab
    if (activeTab === "contato-localizacao") {
      setActiveTab("informacoes-basicas")
    } else if (activeTab === "informacoes-operacionais") {
      setActiveTab("contato-localizacao")
    } else if (activeTab === "documentos-compliance") {
      setActiveTab("informacoes-operacionais")
    }
  }

  const handleSubmit = async (data: Partial<Fornecedor>) => {
    setIsSubmitting(true)

    try {
      // Merge all form data
      const finalData = { ...formData, ...data }

      // Update the fornecedor
      const index = mockFornecedores.findIndex((f) => f.id === id)
      if (index !== -1) {
        mockFornecedores[index] = {
          ...mockFornecedores[index],
          ...finalData,
        }
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message
      setShowSuccess(true)

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/fornecedores")
      }, 3000)
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error)
      alert("Erro ao atualizar fornecedor. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Fornecedor atualizado com sucesso!</h2>
          <p className="text-gray-500 mb-6">As informações do fornecedor foram atualizadas no sistema.</p>
          <Button onClick={() => router.push("/fornecedores")} className="w-full">
            Voltar para Lista de Fornecedores
          </Button>
        </div>
      </div>
    )
  }

  if (!fornecedor) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Fornecedor</h1>
          <p className="text-muted-foreground">Atualize os dados do fornecedor</p>
        </div>
        <Link href="/fornecedores">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="informacoes-basicas">Informações Básicas</TabsTrigger>
              <TabsTrigger value="contato-localizacao">Contato e Localização</TabsTrigger>
              <TabsTrigger value="informacoes-operacionais">Informações Operacionais</TabsTrigger>
              <TabsTrigger value="documentos-compliance">Documentos e Compliance</TabsTrigger>
            </TabsList>

            <TabsContent value="informacoes-basicas">
              <DataForm
                key={`basicas-${formKey}`}
                model="fornecedor"
                fields={[
                  { name: "nome", label: "Nome/Razão Social", required: true },
                  { name: "nomeFantasia", label: "Nome Fantasia" },
                  { name: "cnpj", label: "CPF/CNPJ", placeholder: "000.000.000-00 ou 00.000.000/0000-00" },
                  { name: "inscricaoEstadual", label: "Inscrição Estadual" },
                  {
                    name: "tipoFornecedor",
                    label: "Tipo de Fornecedor",
                    type: "select",
                    options: [
                      { value: "PJ", label: "Pessoa Jurídica" },
                      { value: "PF", label: "Pessoa Física" },
                    ],
                  },
                ]}
                submitLabel="Próximo"
                onSubmit={handleNext}
                initialData={formData}
              />
            </TabsContent>

            <TabsContent value="contato-localizacao">
              <DataForm
                key={`contato-${formKey}`}
                model="fornecedor"
                fields={[
                  { name: "telefone", label: "Telefone Comercial", placeholder: "(00) 0000-0000" },
                  { name: "email", label: "E-mail de Contato", placeholder: "contato@empresa.com" },
                  { name: "site", label: "Site", placeholder: "www.empresa.com" },
                  { name: "responsavelComercial", label: "Nome do Responsável Comercial" },
                  { name: "endereco", label: "Endereço", placeholder: "Rua, número, complemento" },
                  { name: "bairro", label: "Bairro" },
                  { name: "cidade", label: "Cidade" },
                  { name: "estado", label: "Estado" },
                  { name: "cep", label: "CEP", placeholder: "00000-000" },
                ]}
                submitLabel="Próximo"
                onSubmit={handleNext}
                initialData={formData}
                extraButtons={
                  <Button type="button" variant="outline" onClick={handlePrevious} className="mr-2">
                    Anterior
                  </Button>
                }
              />
            </TabsContent>

            <TabsContent value="informacoes-operacionais">
              <DataForm
                key={`operacionais-${formKey}`}
                model="fornecedor"
                fields={[
                  { name: "produtosServicos", label: "Produtos/Serviços Fornecidos", type: "textarea" },
                  {
                    name: "categoria",
                    label: "Categoria",
                    type: "select",
                    options: [
                      { value: "EPI", label: "EPI" },
                      { value: "Treinamentos", label: "Treinamentos" },
                      { value: "Consultoria", label: "Consultoria" },
                      { value: "Equipamentos", label: "Equipamentos" },
                      { value: "Outros", label: "Outros" },
                    ],
                  },
                  { name: "dataInicioRelacionamento", label: "Data de Início do Relacionamento", type: "date" },
                  {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: [
                      { value: "Ativo", label: "Ativo" },
                      { value: "Inativo", label: "Inativo" },
                    ],
                  },
                ]}
                submitLabel="Próximo"
                onSubmit={handleNext}
                initialData={formData}
                extraButtons={
                  <Button type="button" variant="outline" onClick={handlePrevious} className="mr-2">
                    Anterior
                  </Button>
                }
              />
            </TabsContent>

            <TabsContent value="documentos-compliance">
              <DataForm
                key={`documentos-${formKey}`}
                model="fornecedor"
                fields={[
                  { name: "certificacoes", label: "Certificações (ISO, NR, etc.)", type: "textarea" },
                  { name: "contratoVigente", label: "Contrato ou Proposta Vigente", type: "textarea" },
                  { name: "observacoes", label: "Observações Gerais", type: "textarea" },
                ]}
                submitLabel={isSubmitting ? "Salvando..." : "Salvar Fornecedor"}
                onSubmit={handleSubmit}
                initialData={formData}
                extraButtons={
                  <Button type="button" variant="outline" onClick={handlePrevious} className="mr-2">
                    Anterior
                  </Button>
                }
                disabled={isSubmitting}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
