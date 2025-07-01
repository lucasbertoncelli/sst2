"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmpresaForm } from "@/components/forms/empresa-form"
import { Building, Edit, Plus } from "lucide-react"
import type { Empresa } from "@/types"

export default function EmpresaPage() {
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showSuccessScreen, setShowSuccessScreen] = useState(false)

  useEffect(() => {
    // Simular carregamento dos dados da empresa
    const loadEmpresa = () => {
      const savedEmpresa = localStorage.getItem("empresa")
      if (savedEmpresa) {
        setEmpresa(JSON.parse(savedEmpresa))
      }
      setLoading(false)
    }

    loadEmpresa()
  }, [])

  const handleSave = (empresaData: Empresa) => {
    // Salvar no localStorage (em produção seria uma API)
    localStorage.setItem("empresa", JSON.stringify(empresaData))
    setEmpresa(empresaData)
    setShowForm(false)
    setShowSuccessScreen(true)
  }

  const handleEdit = () => {
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
  }

  const handleCloseSuccess = () => {
    setShowSuccessScreen(false)
  }

  if (showSuccessScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Dados salvos com sucesso!</h2>
            <p className="text-gray-600 mb-6">
              As informações da empresa foram salvas e serão utilizadas nos documentos gerados pelo sistema.
            </p>
            <Button onClick={handleCloseSuccess} className="w-full">
              Continuar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (showForm) {
    return <EmpresaForm empresa={empresa || undefined} onSave={handleSave} onCancel={handleCancel} />
  }

  if (!empresa) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma empresa cadastrada</h2>
          <p className="text-gray-600 mb-6">
            Configure as informações da sua empresa para que apareçam nos documentos gerados pelo sistema.
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Empresa
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building className="h-6 w-6" />
          <div>
            <h1 className="text-2xl font-bold">Dados da Empresa</h1>
            <p className="text-gray-600">Informações da empresa cadastrada no sistema</p>
          </div>
        </div>
        <Button onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      {/* Logo da empresa */}
      {(empresa.logoBase64 || empresa.logoUrl) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Logo da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="border rounded-md p-4 bg-gray-50 max-w-xs">
              <img
                src={empresa.logoBase64 || empresa.logoUrl}
                alt="Logo da empresa"
                className="max-h-40 max-w-full object-contain mx-auto"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {/* Dados Básicos */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Básicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Razão Social</label>
                <p className="text-gray-900">{empresa.razaoSocial}</p>
              </div>
              {empresa.nomeFantasia && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Nome Fantasia</label>
                  <p className="text-gray-900">{empresa.nomeFantasia}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">CNPJ</label>
                <p className="text-gray-900">{empresa.cnpj}</p>
              </div>
              {empresa.inscricaoEstadual && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Inscrição Estadual</label>
                  <p className="text-gray-900">{empresa.inscricaoEstadual}</p>
                </div>
              )}
              {empresa.inscricaoMunicipal && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Inscrição Municipal</label>
                  <p className="text-gray-900">{empresa.inscricaoMunicipal}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informações de Contato */}
        {(empresa.telefone || empresa.email || empresa.site) && (
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {empresa.telefone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Telefone</label>
                    <p className="text-gray-900">{empresa.telefone}</p>
                  </div>
                )}
                {empresa.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">E-mail</label>
                    <p className="text-gray-900">{empresa.email}</p>
                  </div>
                )}
                {empresa.site && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Site</label>
                    <p className="text-gray-900">{empresa.site}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {empresa.enderecoCompleto && (
              <div>
                <label className="text-sm font-medium text-gray-500">Endereço Completo</label>
                <p className="text-gray-900">{empresa.enderecoCompleto}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {empresa.bairro && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Bairro</label>
                  <p className="text-gray-900">{empresa.bairro}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Cidade</label>
                <p className="text-gray-900">{empresa.cidade}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Estado</label>
                <p className="text-gray-900">{empresa.estado}</p>
              </div>
              {empresa.cep && (
                <div>
                  <label className="text-sm font-medium text-gray-500">CEP</label>
                  <p className="text-gray-900">{empresa.cep}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Responsáveis */}
        {(empresa.responsavelLegal || empresa.telefoneResponsavel || empresa.emailResponsavel) && (
          <Card>
            <CardHeader>
              <CardTitle>Responsáveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {empresa.responsavelLegal && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Responsável Legal</label>
                    <p className="text-gray-900">{empresa.responsavelLegal}</p>
                  </div>
                )}
                {empresa.telefoneResponsavel && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Telefone</label>
                    <p className="text-gray-900">{empresa.telefoneResponsavel}</p>
                  </div>
                )}
                {empresa.emailResponsavel && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">E-mail</label>
                    <p className="text-gray-900">{empresa.emailResponsavel}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informações Adicionais */}
        {empresa.observacoes && (
          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Observações</label>
                <p className="text-gray-900 whitespace-pre-wrap">{empresa.observacoes}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
