"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Save, X, Upload, Trash2 } from "lucide-react"
import type { Empresa } from "@/types"

interface EmpresaFormProps {
  empresa?: Empresa
  onSave: (empresa: Empresa) => void
  onCancel: () => void
}

export function EmpresaForm({ empresa, onSave, onCancel }: EmpresaFormProps) {
  const [formData, setFormData] = useState<Partial<Empresa>>({
    razaoSocial: empresa?.razaoSocial || "",
    nomeFantasia: empresa?.nomeFantasia || "",
    cnpj: empresa?.cnpj || "",
    inscricaoEstadual: empresa?.inscricaoEstadual || "",
    inscricaoMunicipal: empresa?.inscricaoMunicipal || "",
    telefone: empresa?.telefone || "",
    email: empresa?.email || "",
    site: empresa?.site || "",
    enderecoCompleto: empresa?.enderecoCompleto || "",
    bairro: empresa?.bairro || "",
    cidade: empresa?.cidade || "",
    estado: empresa?.estado || "",
    cep: empresa?.cep || "",
    responsavelLegal: empresa?.responsavelLegal || "",
    telefoneResponsavel: empresa?.telefoneResponsavel || "",
    emailResponsavel: empresa?.emailResponsavel || "",
    logoUrl: empresa?.logoUrl || "",
    logoBase64: empresa?.logoBase64 || "",
    observacoes: empresa?.observacoes || "",
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.razaoSocial || !formData.cnpj || !formData.cidade || !formData.estado) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    const empresaData: Empresa = {
      id: empresa?.id || Date.now().toString(),
      razaoSocial: formData.razaoSocial,
      nomeFantasia: formData.nomeFantasia,
      cnpj: formData.cnpj,
      inscricaoEstadual: formData.inscricaoEstadual,
      inscricaoMunicipal: formData.inscricaoMunicipal,
      telefone: formData.telefone,
      email: formData.email,
      site: formData.site,
      enderecoCompleto: formData.enderecoCompleto,
      bairro: formData.bairro,
      cidade: formData.cidade,
      estado: formData.estado,
      cep: formData.cep,
      responsavelLegal: formData.responsavelLegal,
      telefoneResponsavel: formData.telefoneResponsavel,
      emailResponsavel: formData.emailResponsavel,
      logoUrl: formData.logoUrl,
      logoBase64: formData.logoBase64,
      observacoes: formData.observacoes,
    }

    onSave(empresaData)
  }

  const handleChange = (field: keyof Empresa, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Verificar o tamanho do arquivo (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("O arquivo é muito grande. O tamanho máximo é 2MB.")
      return
    }

    // Verificar o tipo do arquivo
    if (!file.type.match("image.*")) {
      alert("Por favor, selecione uma imagem válida.")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setFormData((prev) => ({ ...prev, logoBase64: base64 }))
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logoBase64: "", logoUrl: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Building className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Dados da Empresa</h1>
          <p className="text-gray-600">
            Configure as informações da sua empresa que aparecerão nos documentos gerados pelo sistema.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Básicos */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Básicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="razaoSocial">Razão Social *</Label>
                <Input
                  id="razaoSocial"
                  value={formData.razaoSocial}
                  onChange={(e) => handleChange("razaoSocial", e.target.value)}
                  placeholder="Ex: Empresa Exemplo Ltda"
                  required
                />
              </div>
              <div>
                <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                <Input
                  id="nomeFantasia"
                  value={formData.nomeFantasia}
                  onChange={(e) => handleChange("nomeFantasia", e.target.value)}
                  placeholder="Ex: Exemplo Corp"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleChange("cnpj", e.target.value)}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                <Input
                  id="inscricaoEstadual"
                  value={formData.inscricaoEstadual}
                  onChange={(e) => handleChange("inscricaoEstadual", e.target.value)}
                  placeholder="000.000.000.000"
                />
              </div>
              <div>
                <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
                <Input
                  id="inscricaoMunicipal"
                  value={formData.inscricaoMunicipal}
                  onChange={(e) => handleChange("inscricaoMunicipal", e.target.value)}
                  placeholder="00000000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Contato */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleChange("telefone", e.target.value)}
                  placeholder="(11) 9999-9999"
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="contato@empresa.com"
                />
              </div>
              <div>
                <Label htmlFor="site">Site</Label>
                <Input
                  id="site"
                  value={formData.site}
                  onChange={(e) => handleChange("site", e.target.value)}
                  placeholder="www.empresa.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="enderecoCompleto">Endereço Completo</Label>
              <Input
                id="enderecoCompleto"
                value={formData.enderecoCompleto}
                onChange={(e) => handleChange("enderecoCompleto", e.target.value)}
                placeholder="Rua, Avenida, número, complemento"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => handleChange("bairro", e.target.value)}
                  placeholder="Centro"
                />
              </div>
              <div>
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => handleChange("cidade", e.target.value)}
                  placeholder="São Paulo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="estado">Estado *</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => handleChange("estado", e.target.value)}
                  placeholder="SP"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => handleChange("cep", e.target.value)}
                  placeholder="00000-000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsáveis */}
        <Card>
          <CardHeader>
            <CardTitle>Responsáveis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="responsavelLegal">Responsável Legal</Label>
                <Input
                  id="responsavelLegal"
                  value={formData.responsavelLegal}
                  onChange={(e) => handleChange("responsavelLegal", e.target.value)}
                  placeholder="Nome do responsável legal"
                />
              </div>
              <div>
                <Label htmlFor="telefoneResponsavel">Telefone</Label>
                <Input
                  id="telefoneResponsavel"
                  value={formData.telefoneResponsavel}
                  onChange={(e) => handleChange("telefoneResponsavel", e.target.value)}
                  placeholder="(11) 9999-9999"
                />
              </div>
              <div>
                <Label htmlFor="emailResponsavel">E-mail</Label>
                <Input
                  id="emailResponsavel"
                  type="email"
                  value={formData.emailResponsavel}
                  onChange={(e) => handleChange("emailResponsavel", e.target.value)}
                  placeholder="contato@empresa.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="logoUpload">Logo da Empresa</Label>
              <div className="mt-2 space-y-4">
                {formData.logoBase64 ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="border rounded-md p-2 bg-gray-50 max-w-xs">
                      <img
                        src={formData.logoBase64 || "/placeholder.svg"}
                        alt="Logo da empresa"
                        className="max-h-40 max-w-full object-contain mx-auto"
                      />
                    </div>
                    <Button type="button" variant="destructive" size="sm" onClick={handleRemoveLogo}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover Logo
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Clique para fazer upload do logo da empresa</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG ou SVG (máx. 2MB)</p>
                    </div>
                    <Input
                      id="logoUpload"
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Arquivo
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="logoUrl">URL do Logo (opcional)</Label>
              <Input
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) => handleChange("logoUrl", e.target.value)}
                placeholder="https://exemplo.com/logo.png"
                disabled={!!formData.logoBase64}
              />
              {formData.logoBase64 && (
                <p className="text-xs text-gray-500 mt-1">Campo desabilitado pois você já fez upload de uma imagem.</p>
              )}
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleChange("observacoes", e.target.value)}
                placeholder="Informações adicionais sobre a empresa..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botões */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </form>
    </div>
  )
}
