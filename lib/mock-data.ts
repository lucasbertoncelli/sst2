import type {
  Usuario,
  Setor,
  Turno,
  Funcionario,
  Fornecedor,
  RelTreinamentosFuncionario,
  Absenteismo,
  EPI,
  EntregaEPI,
  EstoqueEPI,
  DDS,
  Acidente,
} from "@/types"

// Manter todas as exportações existentes
export const mockSetores: Setor[] = [
  { id: "1", nome: "Produção" },
  { id: "2", nome: "Qualidade" },
  { id: "3", nome: "Manutenção" },
  { id: "4", nome: "Administração" },
  { id: "5", nome: "Logística" },
]

export const mockTurnos: Turno[] = [
  {
    id: "1",
    nome: "Manhã",
    horaInicio: "06:00",
    horaFim: "14:00",
    diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
    intervalo: "09:00-09:15, 12:00-13:00",
    cargaHorariaDiaria: 8,
    observacoes: "Turno padrão da manhã",
  },
  {
    id: "2",
    nome: "Tarde",
    horaInicio: "14:00",
    horaFim: "22:00",
    diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
    intervalo: "17:00-17:15, 19:00-20:00",
    cargaHorariaDiaria: 8,
    observacoes: "Turno da tarde",
  },
  {
    id: "3",
    nome: "Noite",
    horaInicio: "22:00",
    horaFim: "06:00",
    diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
    intervalo: "02:00-02:15, 04:00-05:00",
    cargaHorariaDiaria: 8,
    observacoes: "Turno noturno",
  },
  {
    id: "4",
    nome: "Administrativo",
    horaInicio: "08:00",
    horaFim: "17:00",
    diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
    intervalo: "12:00-13:00",
    cargaHorariaDiaria: 8,
    observacoes: "Horário administrativo",
  },
]

export const mockFornecedores: Fornecedor[] = [
  { id: "1", nome: "Fornecedor Alpha", cnpj: "12.345.678/0001-90", telefone: "(11) 3456-7890" },
  { id: "2", nome: "Fornecedor Beta", cnpj: "98.765.432/0001-10", telefone: "(11) 9876-5432" },
  { id: "3", nome: "Fornecedor Gamma", cnpj: "11.222.333/0001-44", telefone: "(11) 1122-3344" },
  { id: "4", nome: "Fornecedor Delta", cnpj: "55.666.777/0001-88", telefone: "(11) 5566-7788" },
]

export const mockUsuarios: Usuario[] = [
  { id: "1", email: "admin@empresa.com", senha: "admin123", role: "admin" },
  { id: "2", email: "rh@empresa.com", senha: "rh123", role: "rh" },
  { id: "3", email: "sst@empresa.com", senha: "sst123", role: "sst" },
  { id: "4", email: "viewer@empresa.com", senha: "viewer123", role: "viewer" },
]

export const mockFuncionarios: Funcionario[] = [
  { id: "1", nome: "João Silva", setor: "Produção", cargo: "Operador" },
  { id: "2", nome: "Maria Santos", setor: "Qualidade", cargo: "Analista" },
  { id: "3", nome: "Pedro Costa", setor: "Manutenção", cargo: "Técnico" },
  { id: "4", nome: "Ana Oliveira", setor: "Administração", cargo: "Assistente" },
  { id: "5", nome: "Carlos Ferreira", setor: "Produção", cargo: "Supervisor" },
  { id: "6", nome: "Lucia Mendes", setor: "Qualidade", cargo: "Coordenadora" },
  { id: "7", nome: "Roberto Lima", setor: "Logística", cargo: "Auxiliar" },
  { id: "8", nome: "Fernanda Rocha", setor: "Administração", cargo: "Gerente" },
  { id: "9", nome: "José Almeida", setor: "Produção", cargo: "Operador" },
  { id: "10", nome: "Carla Souza", setor: "Manutenção", cargo: "Técnica" },
]

// Manter a estrutura original de treinamentos
export const mockTreinamentos = [
  {
    id: "1",
    titulo: "NR-12 Segurança em Máquinas",
    tipo: "Obrigatório",
    dataRealizacao: new Date("2023-01-15"),
    validade: new Date("2024-01-15"),
    status: "concluido",
    responsavel: {
      tipo: "funcionario",
      funcionarioId: "1",
    },
    observacoes: "Treinamento obrigatório para operadores de máquinas.",
  },
  {
    id: "2",
    titulo: "Primeiros Socorros",
    tipo: "Capacitação",
    dataRealizacao: new Date("2023-03-10"),
    validade: new Date("2024-03-10"),
    status: "concluido",
    responsavel: {
      tipo: "terceirizado",
      nomeResponsavel: "Dr. Roberto Silva",
      empresaResponsavel: "MedSeg Treinamentos",
    },
    observacoes: "Treinamento básico de primeiros socorros para todos os funcionários.",
  },
  {
    id: "3",
    titulo: "Brigada de Incêndio",
    tipo: "Obrigatório",
    dataRealizacao: new Date("2023-05-20"),
    validade: new Date("2024-05-20"),
    status: "pendente",
    responsavel: {
      tipo: "terceirizado",
      nomeResponsavel: "Capitão Marcos Oliveira",
      empresaResponsavel: "Corpo de Bombeiros",
    },
    observacoes: "Treinamento para formação da brigada de incêndio da empresa.",
  },
  {
    id: "4",
    titulo: "Treinamento RD10K",
    tipo: "Capacitação",
    dataRealizacao: new Date("2023-05-29"),
    validade: new Date("2024-06-25"),
    status: "cancelado",
    responsavel: {
      tipo: "funcionario",
      funcionarioId: "2",
    },
    observacoes: "Treinamento específico para operação do equipamento RD10K.",
  },
]

export const mockRelTreinamentos: RelTreinamentosFuncionario[] = [
  {
    id: "1",
    funcionarioId: "1",
    treinamentoId: "1",
    dataRealizacao: new Date("2024-01-15"),
    status: "concluido",
    funcionario: mockFuncionarios[0],
    treinamento: mockTreinamentos[0],
  },
  {
    id: "2",
    funcionarioId: "2",
    treinamentoId: "2",
    dataRealizacao: new Date("2024-02-10"),
    status: "pendente",
    funcionario: mockFuncionarios[1],
    treinamento: mockTreinamentos[1],
  },
  {
    id: "3",
    funcionarioId: "3",
    treinamentoId: "3",
    dataRealizacao: new Date("2024-01-20"),
    status: "concluido",
    funcionario: mockFuncionarios[2],
    treinamento: mockTreinamentos[2],
  },
]

export const mockAbsenteismo: Absenteismo[] = [
  {
    id: "1",
    funcionarioId: "1",
    tipo: "Atestado Médico",
    dataInicio: new Date("2024-01-10"),
    dataFim: new Date("2024-01-12"),
    justificativa: "Gripe",
    funcionario: mockFuncionarios[0],
  },
  {
    id: "2",
    funcionarioId: "2",
    tipo: "Falta Justificada",
    dataInicio: new Date("2024-01-15"),
    dataFim: new Date("2024-01-15"),
    justificativa: "Consulta médica",
    funcionario: mockFuncionarios[1],
  },
  {
    id: "3",
    funcionarioId: "4",
    tipo: "Atestado Médico",
    turno: "Manhã",
    cid: "M79.9",
    dataInicio: new Date("2024-02-05"),
    dataFim: new Date("2024-02-07"),
    horasPerdidas: 24,
    justificativa: "Dor nas costas - lesão muscular",
    funcionario: mockFuncionarios[3],
  },
  {
    id: "4",
    funcionarioId: "5",
    tipo: "Atestado Médico",
    turno: "Tarde",
    cid: "J06.9",
    dataInicio: new Date("2024-02-12"),
    dataFim: new Date("2024-02-14"),
    horasPerdidas: 24,
    justificativa: "Infecção respiratória aguda",
    funcionario: mockFuncionarios[4],
  },
  {
    id: "5",
    funcionarioId: "7",
    tipo: "Falta Justificada",
    turno: "Noite",
    cid: undefined,
    dataInicio: new Date("2024-02-20"),
    dataFim: new Date("2024-02-20"),
    horasPerdidas: 8,
    justificativa: "Acompanhamento médico familiar",
    funcionario: mockFuncionarios[6],
  },
]

export const mockEPIs: EPI[] = [
  {
    id: "1",
    nome: "Capacete de Segurança",
    quantidade: 50,
    localEstoque: "Almoxarifado A",
    fornecedorId: "1",
    fornecedor: mockFornecedores[0],
  },
  {
    id: "2",
    nome: "Óculos de Proteção",
    quantidade: 30,
    localEstoque: "Almoxarifado B",
    fornecedorId: "2",
    fornecedor: mockFornecedores[1],
  },
  {
    id: "3",
    nome: "Luvas de Segurança",
    quantidade: 100,
    localEstoque: "Almoxarifado A",
    fornecedorId: "3",
    fornecedor: mockFornecedores[2],
  },
  {
    id: "4",
    nome: "Botina de Segurança",
    quantidade: 25,
    localEstoque: "Almoxarifado C",
    fornecedorId: "1",
    fornecedor: mockFornecedores[0],
  },
]

export const mockEntregasEPI: EntregaEPI[] = [
  {
    id: "1",
    funcionarioId: "1",
    epiId: "1",
    ca: "12345",
    validade: new Date("2025-12-31"),
    dataFabricacao: new Date("2024-01-15"),
    dataEntrega: new Date("2024-01-05"),
    funcionario: mockFuncionarios[0],
    epi: mockEPIs[0],
  },
  {
    id: "2",
    funcionarioId: "2",
    epiId: "2",
    ca: "23456",
    validade: new Date("2024-08-30"),
    dataFabricacao: new Date("2023-08-30"),
    dataEntrega: new Date("2024-01-08"),
    funcionario: mockFuncionarios[1],
    epi: mockEPIs[1],
  },
]

export const mockEstoqueEPI: EstoqueEPI[] = [
  { id: "1", epiId: "1", quantidade: 50, fornecedor: "EPI Segurança Ltda", epi: mockEPIs[0] },
  { id: "2", epiId: "2", quantidade: 30, fornecedor: "Proteção Total", epi: mockEPIs[1] },
  { id: "3", epiId: "3", quantidade: 100, fornecedor: "Segurança & Cia", epi: mockEPIs[2] },
  { id: "4", epiId: "4", quantidade: 25, fornecedor: "EPI Segurança Ltda", epi: mockEPIs[3] },
]

export const mockDDS: DDS[] = [
  {
    id: "1",
    tema: "Uso Correto de EPIs",
    responsavel: "Carlos Ferreira",
    data: new Date("2024-01-15"),
    participantes: [mockFuncionarios[0], mockFuncionarios[1]],
  },
  {
    id: "2",
    tema: "Prevenção de Acidentes",
    responsavel: "Ana Oliveira",
    data: new Date("2024-01-22"),
    participantes: [mockFuncionarios[2], mockFuncionarios[3]],
  },
]

export const mockAcidentes: Acidente[] = [
  {
    id: "1",
    funcionarioId: "1",
    tipo: "Corte",
    cid: "S61.9",
    gravidade: "Leve",
    data: new Date("2024-01-10"),
    tempoAfastamento: 2,
    funcionario: mockFuncionarios[0],
  },
  {
    id: "2",
    funcionarioId: "3",
    tipo: "Contusão",
    cid: "S30.1",
    gravidade: "Moderada",
    data: new Date("2024-01-20"),
    tempoAfastamento: 5,
    funcionario: mockFuncionarios[2],
  },
]

// Adicionar a exportação mockData no final do arquivo, após todas as outras exportações existentes

// Adicione esta exportação no final do arquivo:
export const mockData = {
  setores: mockSetores,
  turnos: mockTurnos,
  fornecedores: mockFornecedores,
  usuarios: mockUsuarios,
  funcionarios: mockFuncionarios,
  treinamentos: mockTreinamentos,
  relTreinamentos: mockRelTreinamentos,
  absenteismo: mockAbsenteismo,
  epis: mockEPIs,
  entregasEPI: mockEntregasEPI,
  estoqueEPI: mockEstoqueEPI,
  dds: mockDDS,
  acidentes: mockAcidentes,
}
