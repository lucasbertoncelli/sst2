"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface FieldOption {
  value: string
  label: string
}

interface FieldDefinition {
  name: string
  type?: "text" | "date" | "select" | "textarea" | "number" | "boolean"
  label?: string
  placeholder?: string
  options?: FieldOption[]
  required?: boolean
  min?: number
  max?: number
}

interface DataFormProps {
  model: string
  fields: (string | FieldDefinition)[]
  submitLabel?: string
  onSubmit?: (data: any) => void
  onCancel?: () => void
  title?: string
  initialData?: any
}

interface FieldConfig {
  type: "text" | "date" | "select" | "textarea" | "number" | "boolean"
  label: string
  placeholder?: string
  options?: FieldOption[]
  required?: boolean
  min?: number
  max?: number
}

const dateToLocalString = (date: Date): string => {
  if (!date) return ""
  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return ""
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, "0")
    const day = String(dateObj.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  } catch (error) {
    console.error("Erro ao converter data:", error)
    return ""
  }
}

const fieldConfigs: Record<string, Record<string, Omit<FieldConfig, "options"> & { options?: () => FieldOption[] }>> = {
  setor: {
    nome: { type: "text", label: "Nome do Setor", placeholder: "Ex: Produção", required: true },
  },
  epi: {
    nome: { type: "text", label: "Nome do EPI", placeholder: "Ex: Capacete de Segurança", required: true },
    quantidade: {
      type: "number",
      label: "Quantidade em Estoque",
      placeholder: "Ex: 50",
      required: true,
      min: 1,
    },
    localEstoque: { type: "text", label: "Local de Estoque", placeholder: "Ex: Almoxarifado A", required: false },
    fornecedorId: {
      type: "select",
      label: "Fornecedor",
      required: false,
    },
  },
  fornecedor: {
    nome: { type: "text", label: "Nome do Fornecedor", placeholder: "Digite o nome do fornecedor", required: true },
    cnpj: { type: "text", label: "CNPJ", placeholder: "00.000.000/0000-00", required: false },
    telefone: { type: "text", label: "Telefone", placeholder: "(00) 0000-0000", required: false },
  },
  funcionario: {
    nome: { type: "text", label: "Nome Completo", placeholder: "Ex: João Silva", required: true },
    cpf: { type: "text", label: "CPF", placeholder: "000.000.000-00", required: false },
    rg: { type: "text", label: "RG", placeholder: "00.000.000-0", required: false },
    dataNascimento: { type: "date", label: "Data de Nascimento", required: false },
    sexo: {
      type: "select",
      label: "Sexo",
      required: false,
    },
    estadoCivil: {
      type: "select",
      label: "Estado Civil",
      required: false,
    },
    email: { type: "text", label: "E-mail", placeholder: "exemplo@email.com", required: false },
    telefone: { type: "text", label: "Telefone", placeholder: "(00) 00000-0000", required: false },
    rua: { type: "text", label: "Rua", placeholder: "Ex: Rua das Flores", required: false },
    numero: { type: "text", label: "Número", placeholder: "Ex: 123", required: false },
    bairro: { type: "text", label: "Bairro", placeholder: "Ex: Centro", required: false },
    cidade: { type: "text", label: "Cidade", placeholder: "Ex: São Paulo", required: false },
    estado: {
      type: "select",
      label: "Estado",
      required: false,
    },
    cep: { type: "text", label: "CEP", placeholder: "00000-000", required: false },
    matricula: { type: "text", label: "Matrícula", placeholder: "Ex: F12345", required: false },
    cargo: { type: "text", label: "Cargo", placeholder: "Ex: Operador", required: false },
    setorId: {
      type: "select",
      label: "Setor",
      required: true,
    },
    tipoContrato: {
      type: "select",
      label: "Tipo de Contrato",
      required: false,
    },
    dataAdmissao: { type: "date", label: "Data de Admissão", required: false },
    dataDemissao: { type: "date", label: "Data de Demissão", required: false },
    status: {
      type: "select",
      label: "Status",
      required: false,
    },
    pis: { type: "text", label: "PIS/PASEP", placeholder: "000.00000.00-0", required: false },
    localTrabalho: { type: "text", label: "Local de Trabalho", placeholder: "Ex: Sede Principal", required: false },
    exposicaoRisco: { type: "boolean", label: "Exposição a Risco", required: false },
    necessitaEpi: { type: "boolean", label: "Necessita de EPI", required: false },
    dataASO: { type: "date", label: "Data do último ASO", required: false },
    tipoSanguineo: {
      type: "select",
      label: "Tipo Sanguíneo",
      required: false,
    },
    turno: {
      type: "select",
      label: "Turno",
      required: false,
    },
    jornadaSemanal: {
      type: "number",
      label: "Jornada Semanal (horas)",
      placeholder: "Ex: 44",
      required: false,
      min: 1,
      max: 60,
    },
    gestor: { type: "text", label: "Gestor Responsável", placeholder: "Nome do gestor", required: false },
    observacoes: {
      type: "textarea",
      label: "Observações",
      placeholder: "Informações adicionais sobre o funcionário",
      required: false,
    },
  },
}

const staticOptions: Record<string, FieldOption[]> = {
  sexo: [
    { value: "Masculino", label: "Masculino" },
    { value: "Feminino", label: "Feminino" },
    { value: "Outro", label: "Outro" },
  ],
  estadoCivil: [
    { value: "Solteiro(a)", label: "Solteiro(a)" },
    { value: "Casado(a)", label: "Casado(a)" },
    { value: "Divorciado(a)", label: "Divorciado(a)" },
    { value: "Viúvo(a)", label: "Viúvo(a)" },
    { value: "União Estável", label: "União Estável" },
  ],
  estado: [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" },
  ],
  tipoContrato: [
    { value: "CLT", label: "CLT" },
    { value: "Estágio", label: "Estágio" },
    { value: "Temporário", label: "Temporário" },
    { value: "Outro", label: "Outro" },
  ],
  status: [
    { value: "Ativo", label: "Ativo" },
    { value: "Inativo", label: "Inativo" },
  ],
  tipoSanguineo: [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ],
}

export function DataForm({
  model,
  fields,
  submitLabel = "Salvar",
  onSubmit,
  onCancel,
  title,
  initialData,
}: DataFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const modelConfig = fieldConfigs[model] || {}

  useEffect(() => {
    if (initialData) {
      const populatedData: Record<string, any> = {}
      fields.forEach((field) => {
        const fieldName = typeof field === "string" ? field : field.name
        const config = getFieldConfig(field)
        if (initialData[fieldName] !== undefined && initialData[fieldName] !== null) {
          if (config?.type === "date" && initialData[fieldName]) {
            if (initialData[fieldName] instanceof Date) {
              populatedData[fieldName] = dateToLocalString(initialData[fieldName])
            } else if (typeof initialData[fieldName] === "string") {
              try {
                const date = new Date(initialData[fieldName])
                populatedData[fieldName] = dateToLocalString(date)
              } catch {
                populatedData[fieldName] = initialData[fieldName]
              }
            }
          } else {
            populatedData[fieldName] = initialData[fieldName]
          }
        } else {
          populatedData[fieldName] = formData[fieldName] || ""
        }
      })
      setFormData(populatedData)
    }
  }, [initialData, fields])

  const validateField = (fieldName: string, value: any, config: FieldConfig): string | null => {
    if (config.required && (!value || value === "")) {
      return `${config.label} é obrigatório`
    }
    if (config.type === "number" && value !== "" && value !== null && value !== undefined) {
      const numValue = Number(value)
      if (isNaN(numValue)) {
        return `${config.label} deve ser um número válido`
      }
      if (config.min !== undefined && numValue < config.min) {
        return `${config.label} deve ser maior ou igual a ${config.min}`
      }
      if (config.max !== undefined && numValue > config.max) {
        return `${config.label} deve ser menor ou igual a ${config.max}`
      }
    }
    return null
  }

  const handleInputChange = (fieldName: string, value: any) => {
    const field = fields.find((f) => (typeof f === "string" ? f : f.name) === fieldName)
    const config = field ? getFieldConfig(field) : { type: "text" as const, label: fieldName, required: false }

    if (config.type === "number" && value !== "") {
      const numValue = Number(value)
      if (!isNaN(numValue)) {
        if (config.min !== undefined && numValue < config.min) {
          value = config.min
        }
        if (numValue < 0) {
          value = config.min || 0
        }
      }
    }

    setFormData((prev) => ({ ...prev, [fieldName]: value }))

    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    fields.forEach((field) => {
      const fieldName = typeof field === "string" ? field : field.name
      const config = getFieldConfig(field)
      const value = formData[fieldName]
      const error = validateField(fieldName, value, config)
      if (error) {
        newErrors[fieldName] = error
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      if (onSubmit) {
        await onSubmit(formData) // Enviar dados brutos, a página que lida com a conversão
      }
      if (!initialData) {
        setFormData({})
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Erro ao salvar. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
    if (!initialData) {
      setFormData({})
      setErrors({})
    }
  }

  const getFieldConfig = (field: string | FieldDefinition): FieldConfig => {
    if (typeof field === "string") {
      const config = modelConfig[field] || { type: "text", label: field }
      const options = staticOptions[field] || (typeof config.options === "function" ? config.options() : config.options)
      return { ...config, options }
    }
    const baseConfig = modelConfig[field.name] || { type: "text", label: field.name }
    const staticOpts = staticOptions[field.name]
    return {
      ...baseConfig,
      type: field.type || baseConfig.type,
      label: field.label || baseConfig.label,
      placeholder: field.placeholder || baseConfig.placeholder,
      required: field.required !== undefined ? field.required : baseConfig.required,
      min: field.min !== undefined ? field.min : baseConfig.min,
      max: field.max !== undefined ? field.max : baseConfig.max,
      options: field.options || staticOpts || baseConfig.options,
    }
  }

  const renderField = (field: string | FieldDefinition) => {
    const fieldName = typeof field === "string" ? field : field.name
    const config = getFieldConfig(field)
    const hasError = !!errors[fieldName]
    const fieldValue = formData[fieldName] || ""

    const commonProps = { id: fieldName, required: config.required }

    switch (config.type) {
      case "select":
        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={fieldName}>
              {config.label}
              {config.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select value={fieldValue} onValueChange={(value) => handleInputChange(fieldName, value)}>
              <SelectTrigger className={hasError ? "border-red-500" : ""}>
                <SelectValue placeholder={`Selecione ${config.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {config.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && <p className="text-sm text-red-500">{errors[fieldName]}</p>}
          </div>
        )
      case "textarea":
        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={fieldName}>
              {config.label}
              {config.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              {...commonProps}
              placeholder={config.placeholder}
              value={fieldValue}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              className={hasError ? "border-red-500" : ""}
            />
            {hasError && <p className="text-sm text-red-500">{errors[fieldName]}</p>}
          </div>
        )
      case "date":
        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={fieldName}>
              {config.label}
              {config.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="date"
              value={fieldValue}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              className={hasError ? "border-red-500" : ""}
            />
            {hasError && <p className="text-sm text-red-500">{errors[fieldName]}</p>}
          </div>
        )
      case "number":
        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={fieldName}>
              {config.label}
              {config.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="number"
              min={config.min}
              max={config.max}
              placeholder={config.placeholder}
              value={fieldValue}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              className={hasError ? "border-red-500" : ""}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault()
              }}
            />
            {hasError && <p className="text-sm text-red-500">{errors[fieldName]}</p>}
            {config.min !== undefined && <p className="text-xs text-gray-500">Valor mínimo: {config.min}</p>}
          </div>
        )
      case "boolean":
        return (
          <div key={fieldName} className="flex items-center space-x-2 py-2">
            <Checkbox
              id={fieldName}
              checked={fieldValue || false}
              onCheckedChange={(checked) => handleInputChange(fieldName, checked)}
            />
            <Label htmlFor={fieldName} className="cursor-pointer">
              {config.label}
              {config.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {hasError && <p className="text-sm text-red-500">{errors[fieldName]}</p>}
          </div>
        )
      default:
        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={fieldName}>
              {config.label}
              {config.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="text"
              placeholder={config.placeholder}
              value={fieldValue}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              className={hasError ? "border-red-500" : ""}
            />
            {hasError && <p className="text-sm text-red-500">{errors[fieldName]}</p>}
          </div>
        )
    }
  }

  let formTitle = title
  if (!title) {
    formTitle = `Cadastrar ${model.charAt(0).toUpperCase() + model.slice(1)}`
  }

  return (
    <Card className="border-0 shadow-none">
      {title && (
        <CardHeader>
          <CardTitle>{formTitle}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(renderField)}
          <div className="pt-4 flex gap-2">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : submitLabel}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
