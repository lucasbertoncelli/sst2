-- Tabela de funcionários
CREATE TABLE IF NOT EXISTS funcionarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  rg VARCHAR(20),
  data_nascimento DATE,
  telefone VARCHAR(20),
  email VARCHAR(255),
  endereco TEXT,
  cargo VARCHAR(100) NOT NULL,
  setor_id UUID REFERENCES setores(id) ON DELETE SET NULL,
  turno_id UUID REFERENCES turnos(id) ON DELETE SET NULL,
  data_admissao DATE,
  data_demissao DATE,
  salario DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'demitido')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_funcionarios_setor ON funcionarios(setor_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_turno ON funcionarios(turno_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_status ON funcionarios(status);

-- RLS Policies
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;

-- Todos os usuários autenticados podem ver funcionários
DROP POLICY IF EXISTS "Authenticated users can view employees" ON funcionarios;
CREATE POLICY "Authenticated users can view employees" ON funcionarios
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admins e RH podem gerenciar funcionários
DROP POLICY IF EXISTS "Admins and HR can manage employees" ON funcionarios;
CREATE POLICY "Admins and HR can manage employees" ON funcionarios
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios u 
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'rh')
    )
  );

DROP TRIGGER IF EXISTS update_funcionarios_updated_at ON funcionarios;
CREATE TRIGGER update_funcionarios_updated_at BEFORE UPDATE ON funcionarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
