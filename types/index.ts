export interface Empresa {
  id: string
  razaoSocial: string
  nomeFantasia?: string
  cnpj: string
  inscricaoEstadual?: string
  inscricaoMunicipal?: string
  telefone?: string
  email?: string
  site?: string
  enderecoCompleto?: string
  bairro?: string
  cidade: string
  estado: string
  cep?: string
  responsavelLegal?: string
  telefoneResponsavel?: string
  emailResponsavel?: string
  logoUrl?: string
  logoBase64?: string
  observacoes?: string
  nome_empresa?: string // Updated field
}

export interface Profile {
  id: string
  empresa_id: string
  role: "admin" | "user" | "viewer"
}

export interface Setor {
  id: string
  empresa_id: string
  nome: string
  descricao?: string
}

export interface Turno {
  id: string
  empresa_id: string
  nome: string
  hora_inicio: string
  hora_fim: string
  dias_semana: string[] // Changed from INTEGER[] to string[]
  intervalo?: string // Changed from number to string
  carga_horaria_diaria: number // Added this field
  observacoes?: string // Added this field
  ativo?: boolean // Added this field
  created_at?: string
  updated_at?: string
}

export interface Funcionario {
  id: string
  empresa_id: string
  nome: string
  cpf: string
  data_nascimento: string
  genero: string
  email?: string
  telefone?: string
  data_admissao: string
  cargo: string
  setor_id: string
  turno_id: string
  setor?: Setor // Relação opcional
  turno?: Turno // Relação opcional
}

export interface Fornecedor {
  id: string
  empresa_id: string
  nome: string
  cnpj?: string
  contato_nome?: string
  contato_email?: string
  contato_telefone?: string
}

export interface EPI {
  id: string
  empresa_id: string
  nome: string
  descricao?: string
  ca: string
  validade_ca: string
  quantidade_estoque: number
  estoque_minimo: number
  fornecedor_id?: string
  fornecedor?: Fornecedor
}

export interface EntregaEPI {
  id: string
  empresa_id: string
  funcionario_id: string
  epi_id: string
  data_entrega: string
  quantidade: number
  data_devolucao?: string
  motivo_devolucao?: string
  funcionario?: Funcionario
  epi?: EPI
}

export interface Treinamento {
  id: string
  empresa_id: string
  nome: string
  descricao?: string
  carga_horaria: number
  validade_meses?: number
  responsavel_id?: string
  responsavel?: Funcionario
  participantes?: Funcionario[]
}

export interface TreinamentoFuncionario {
  id: string
  treinamento_id: string
  funcionario_id: string
  data_realizacao: string
  data_vencimento?: string
  empresa_id: string
  treinamento?: Treinamento
  funcionario?: Funcionario
}

export interface Absenteismo {
  id: string
  empresa_id: string
  funcionario_id: string
  data_inicio: string
  data_fim: string
  tipo: "Atestado Médico" | "Falta Justificada" | "Falta Injustificada" | "Licença"
  motivo?: string
  cid?: string
  horas_perdidas?: number
  funcionario?: Funcionario
}

export interface Acidente {
  id: string
  empresa_id: string
  funcionario_id: string
  data_acidente: string
  tipo_acidente: string
  local_acidente: string
  descricao: string
  houve_cat: boolean
  cat_numero?: string
  dias_afastamento?: number
  gravidade: "Leve" | "Moderada" | "Grave"
  funcionario?: Funcionario
}

export interface DDS {
  id: string
  empresa_id: string
  data: string
  tema: string
  responsavel: string
  observacoes?: string
  participantes?: Funcionario[]
}

export interface DDSParticipante {
  dds_id: string
  funcionario_id: string
}
