"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataForm } from "@/components/data-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface SelectOption {
  value: string
  label: string
}

export default function CadastroFuncionario() {
  const [activeTab, setActiveTab] = useState("pessoal")
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [setores, setSetores] = useState<SelectOption[]>([])
  const [turnos, setTurnos] = useState<SelectOption[]>([])
  const [loading, setLoading] = useState(true)
  const { profile, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      if (!profile) return

      try {
        setLoading(true)
        // Fetch Setores
        const { data: setoresData, error: setoresError } = await supabase
          .from("setores")
          .select("id, nome")
          .eq("empresa_id", profile.empresa_id)

        if (setoresError) throw setoresError
        setSetores(setoresData.map((s) => ({ value: s.id, label: s.nome })))

        // Fetch Turnos
        const { data: turnosData, error: turnosError } = await supabase
          .from("turnos")
          .select("id, nome, hora_inicio, hora_fim")
          .eq("empresa_id", profile.empresa_id)

        if (turnosError) throw turnosError
        setTurnos(
          turnosData.map((t) => ({
            value: t.id,
            label: `${t.nome} (${t.hora_inicio} - ${t.hora_fim})`,
          })),
        )
      } catch (error) {
        console.error("Erro ao buscar dados para o formulário:", error)
        alert("Não foi possível carregar os dados necessários para o cadastro.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [profile])

  const handleFormSubmit = (tabData: Record<string, any>, nextTab?: string) => {
    const mergedData = { ...formData, ...tabData }
    setFormData(mergedData)

    if (nextTab) {
      setActiveTab(nextTab)
    } else {
      handleFinalSubmit(mergedData)
    }
  }

  const handleFinalSubmit = async (completeData: Record<string, any>) => {
    if (!profile || !user) {
      alert("Erro de autenticação. Faça login novamente.")
      return
    }

    try {
      const funcionarioData = {
        empresa_id: profile.empresa_id,
        created_by: user.id,
        nome: completeData.nome,
        cpf: completeData.cpf || null,
        rg: completeData.rg || null,
        data_nascimento: completeData.dataNascimento || null,
        sexo: completeData.sexo || null,
        estado_civil: completeData.estadoCivil || null,
        email: completeData.email || null,
        telefone: completeData.telefone || null,
        rua: completeData.rua || null,
        numero: completeData.numero || null,
        bairro: completeData.bairro || null,
        cidade: completeData.cidade || null,
        estado: completeData.estado || null,
        cep: completeData.cep || null,
        matricula: completeData.matricula || null,
        cargo: completeData.cargo || null,
        setor_id: completeData.setorId,
        tipo_contrato: completeData.tipoContrato || null,
        data_admissao: completeData.dataAdmissao || null,
        data_demissao: completeData.dataDemissao || null,
        status: completeData.status || "Ativo",
        pis: completeData.pis || null,
        local_trabalho: completeData.localTrabalho || null,
        exposicao_risco: completeData.exposicaoRisco || false,
        necessita_epi: completeData.necessitaEpi || false,
        data_aso: completeData.dataASO || null,
        tipo_sanguineo: completeData.tipoSanguineo || null,
        turno_id: completeData.turno || null,
        jornada_semanal: completeData.jornadaSemanal ? Number(completeData.jornadaSemanal) : null,
        gestor: completeData.gestor || null,
        observacoes: completeData.observacoes || null,
      }

      console.log("Enviando para o Supabase:", funcionarioData)

      const { error } = await supabase.from("funcionarios").insert([funcionarioData])

      if (error) {
        console.error("Erro ao salvar funcionário:", error)
        throw error
      }

      alert("Funcionário cadastrado com sucesso!")
      router.push("/funcionarios")
    } catch (error) {
      alert(`Erro ao cadastrar funcionário: ${(error as Error).message}`)
    }
  }

  if (loading) {
    return <div className="p-6">Carregando dados do formulário...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Cadastro de Funcionário</h1>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Preencha os dados do funcionário</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="pessoal">Informações Pessoais</TabsTrigger>
              <TabsTrigger value="profissional">Informações Profissionais</TabsTrigger>
              <TabsTrigger value="sst">SST e Segurança</TabsTrigger>
              <TabsTrigger value="controle">Controle e Observações</TabsTrigger>
            </TabsList>

            <TabsContent value="pessoal">
              <DataForm
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
                model="funcionario"
                fields={[
                  "matricula",
                  "cargo",
                  { name: "setorId", type: "select", label: "Setor", required: true, options: setores },
                  "tipoContrato",
                  "dataAdmissao",
                  "dataDemissao",
                  "status",
                ]}
                initialData={formData}
                submitLabel="Próximo"
                onSubmit={(data) => handleFormSubmit(data, "sst")}
                onCancel={() => setActiveTab("pessoal")}
              />
            </TabsContent>

            <TabsContent value="sst">
              <DataForm
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
                model="funcionario"
                fields={[
                  { name: "turno", type: "select", label: "Turno", options: turnos },
                  "jornadaSemanal",
                  "gestor",
                  "observacoes",
                ]}
                initialData={formData}
                submitLabel="Salvar Funcionário"
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
