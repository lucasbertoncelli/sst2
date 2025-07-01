-- Tabela de funcionários
CREATE TABLE IF NOT EXISTS funcionarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  rg VARCHAR(20),
  data_nascimento DATE,
  sexo VARCHAR(1) CHECK (sexo IN ('M', 'F')),
  estado_civil VARCHAR(20),
  telefone VARCHAR(20),
  email VARCHAR(255),
  endereco TEXT,
  cargo VARCHAR(255) NOT NULL,
  data_admissao DATE NOT NULL,
  data_demissao DATE,
  setor_id UUID REFERENCES setores(id),
  turno_id UUID REFERENCES turnos(id),
  salario DECIMAL(10,2),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_funcionarios_nome ON funcionarios(nome);
CREATE INDEX IF NOT EXISTS idx_funcionarios_cpf ON funcionarios(cpf);
CREATE INDEX IF NOT EXISTS idx_funcionarios_setor ON funcionarios(setor_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_turno ON funcionarios(turno_id);

-- RLS
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários autenticados podem ver funcionários" ON funcionarios;
CREATE POLICY "Usuários autenticados podem ver funcionários" ON funcionarios
  FOR SELECT USING (auth.role() = 'authenticated');
