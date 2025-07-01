"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataForm } from "@/components/data-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { mockFuncionarios } from "@/lib/mock-data"
import type { Funcionario } from "@/types"

export default function EditarFuncionario() {
  const params = useParams()
  const router = useRouter()
  const funcionarioId = params.id as string

  const [activeTab, setActiveTab] = useState("pessoal")
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Carregar dados do funcionário
  useEffect(() => {
    const funcionarioEncontrado = mockFuncionarios.find((f) => f.id === funcionarioId)
    if (funcionarioEncontrado) {
      console.log("Funcionário encontrado:", funcionarioEncontrado)
      setFuncionario(funcionarioEncontrado)

      // Preencher formData com TODOS os dados existentes do funcionário
      const dadosIniciais = {
        nome: funcionarioEncontrado.nome || "",
        cpf: funcionarioEncontrado.cpf || "",
        rg: funcionarioEncontrado.rg || "",
        dataNascimento: funcionarioEncontrado.dataNascimento || "",
        sexo: funcionarioEncontrado.sexo || "",
        estadoCivil: funcionarioEncontrado.estadoCivil || "",
        email: funcionarioEncontrado.email || "",
        telefone: funcionarioEncontrado.telefone || "",
        rua: funcionarioEncontrado.rua || "",
        numero: funcionarioEncontrado.numero || "",
        bairro: funcionarioEncontrado.bairro || "",
        cidade: funcionarioEncontrado.cidade || "",
        estado: funcionarioEncontrado.estado || "",
        cep: funcionarioEncontrado.cep || "",
        matricula: funcionarioEncontrado.matricula || "",
        cargo: funcionarioEncontrado.cargo || "",
        setorId: funcionarioEncontrado.setor || funcionarioEncontrado.setorId || "", // Usar setor como setorId
        tipoContrato: funcionarioEncontrado.tipoContrato || "",
        dataAdmissao: funcionarioEncontrado.dataAdmissao || "",
        dataDemissao: funcionarioEncontrado.dataDemissao || "",
        status: funcionarioEncontrado.status || "Ativo",
        pis: funcionarioEncontrado.pis || "",
        localTrabalho: funcionarioEncontrado.localTrabalho || "",
        exposicaoRisco: funcionarioEncontrado.exposicaoRisco || false,
        necessitaEpi: funcionarioEncontrado.necessitaEpi || false,
        dataASO: funcionarioEncontrado.dataASO || "",
        tipoSanguineo: funcionarioEncontrado.tipoSanguineo || "",
        turno: funcionarioEncontrado.turno || "",
        jornadaSemanal: funcionarioEncontrado.jornadaSemanal || "",
        gestor: funcionarioEncontrado.gestor || "",
        observacoes: funcionarioEncontrado.observacoes || "",
      }

      console.log("Dados iniciais preparados:", dadosIniciais)
      setFormData(dadosIniciais)
    }
  }, [funcionarioId])

  // Função para mesclar dados do formulário entre abas
  const handleFormSubmit = (tabData: Record<string, any>, nextTab?: string) => {
    console.log("Dados recebidos da aba:", tabData)

    // Mesclar dados do formulário atual com os dados anteriores
    const mergedData = { ...formData, ...tabData }
    console.log("Dados mesclados:", mergedData)
    setFormData(mergedData)

    // Se houver uma próxima aba, navegar para ela
    if (nextTab) {
      setActiveTab(nextTab)
    } else {
      // Se não houver próxima aba, este é o envio final
      handleFinalSubmit(mergedData)
    }
  }

  // Função para lidar com mudança de aba manual
  const handleTabChange = (newTab: string) => {
    console.log("Mudando para aba:", newTab)
    setActiveTab(newTab)
  }

  // Função para salvar todas as alterações do funcionário
  const handleFinalSubmit = async (completeData: Record<string, any>) => {
    setIsLoading(true)

    try {
      // Simular delay de salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Salvando dados completos:", completeData)

      // Atualizar o funcionário no mock data
      const funcionarioIndex = mockFuncionarios.findIndex((f) => f.id === funcionarioId)
      if (funcionarioIndex !== -1) {
        // Criar objeto funcionário atualizado
        const funcionarioAtualizado: Funcionario = {
          ...mockFuncionarios[funcionarioIndex],
          nome: completeData.nome,
          cpf: completeData.cpf,
          rg: completeData.rg,
          dataNascimento: completeData.dataNascimento,
          sexo: completeData.sexo,
          estadoCivil: completeData.estadoCivil,
          email: completeData.email,
          telefone: completeData.telefone,
          rua: completeData.rua,
          numero: completeData.numero,
          bairro: completeData.bairro,
          cidade: completeData.cidade,
          estado: completeData.estado,
          cep: completeData.cep,
          matricula: completeData.matricula,
          cargo: completeData.cargo,
          setor: completeData.setorId, // Mapear setorId para setor
          setorId: completeData.setorId,
          tipoContrato: completeData.tipoContrato,
          dataAdmissao: completeData.dataAdmissao,
          dataDemissao: completeData.dataDemissao,
          status: completeData.status,
          pis: completeData.pis,
          localTrabalho: completeData.localTrabalho,
          exposicaoRisco: completeData.exposicaoRisco,
          necessitaEpi: completeData.necessitaEpi,
          dataASO: completeData.dataASO,
          tipoSanguineo: completeData.tipoSanguineo,
          turno: completeData.turno,
          jornadaSemanal: completeData.jornadaSemanal,
          gestor: completeData.gestor,
          observacoes: completeData.observacoes,
        }

        // Atualizar no array
        mockFuncionarios[funcionarioIndex] = funcionarioAtualizado

        // Atualizar estado local
        setFuncionario(funcionarioAtualizado)

        console.log("Funcionário atualizado:", funcionarioAtualizado)
      }

      // Mostrar mensagem de sucesso
      setShowSuccess(true)

      // Após 3 segundos, voltar para a lista
      setTimeout(() => {
        router.push("/funcionarios")
      }, 3000)
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error)
      alert("Erro ao atualizar funcionário. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!funcionario) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p>Funcionário não encontrado.</p>
          <Button onClick={() => router.push("/funcionarios")} className="mt-4">
            Voltar para Lista
          </Button>
        </div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <div>
                <h2 className="text-xl font-semibold text-green-700">Funcionário Atualizado!</h2>
                <p className="text-muted-foreground mt-2">
                  As informações de <strong>{funcionario.nome}</strong> foram atualizadas com sucesso.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Redirecionando para a lista de funcionários...</p>
                <Button onClick={() => router.push("/funcionarios")} className="w-full">
                  Voltar Agora
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header com botão voltar */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => router.push("/funcionarios")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Editar Funcionário</h1>
          <p className="text-muted-foreground">Editando: {funcionario.nome}</p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Altere os dados do funcionário</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="pessoal">Informações Pessoais</TabsTrigger>
              <TabsTrigger value="profissional">Informações Profissionais</TabsTrigger>
              <TabsTrigger value="sst">SST e Segurança</TabsTrigger>
              <TabsTrigger value="controle">Controle e Observações</TabsTrigger>
            </TabsList>

            <TabsContent value="pessoal">
              <DataForm
                key={`pessoal-${activeTab}`}
                model="funcionario"
                fields={[
                  "nome",
                  "cpf",
                  "rg",
                  "dataNascimento",
                  "sexo",
                  "estadoCivil",
                  "email",
                  "telefone",
                  "rua",
                  "numero",
                  "bairro",
                  "cidade",
                  "estado",
                  "cep",
                ]}
                initialData={formData}
                submitLabel="Próximo"
                onSubmit={(data) => handleFormSubmit(data, "profissional")}
              />
            </TabsContent>

            <TabsContent value="profissional">
              <DataForm
                key={`profissional-${activeTab}`}
                model="funcionario"
                fields={["matricula", "cargo", "setorId", "tipoContrato", "dataAdmissao", "dataDemissao", "status"]}
                initialData={formData}
                submitLabel="Próximo"
                onSubmit={(data) => handleFormSubmit(data, "sst")}
                onCancel={() => setActiveTab("pessoal")}
              />
            </TabsContent>

            <TabsContent value="sst">
              <DataForm
                key={`sst-${activeTab}`}
                model="funcionario"
                fields={["pis", "localTrabalho", "exposicaoRisco", "necessitaEpi", "dataASO", "tipoSanguineo"]}
                initialData={formData}
                submitLabel="Próximo"
                onSubmit={(data) => handleFormSubmit(data, "controle")}
                onCancel={() => setActiveTab("profissional")}
              />
            </TabsContent>

            <TabsContent value="controle">
              <DataForm
                key={`controle-${activeTab}`}
                model="funcionario"
                fields={["turno", "jornadaSemanal", "gestor", "observacoes"]}
                initialData={formData}
                submitLabel={isLoading ? "Salvando..." : "Salvar Alterações"}
                onSubmit={(data) => handleFormSubmit(data)}
                onCancel={() => setActiveTab("sst")}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
