-- Tabela de treinamentos
CREATE TABLE treinamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Obrigatório', 'Capacitação', 'Reciclagem')),
  carga_horaria INTEGER,
  data_realizacao DATE,
  validade DATE,
  status VARCHAR(20) DEFAULT 'planejado' CHECK (status IN ('planejado', 'concluido', 'cancelado', 'pendente')),
  responsavel_tipo VARCHAR(20) CHECK (responsavel_tipo IN ('funcionario', 'terceirizado')),
  responsavel_funcionario_id UUID REFERENCES funcionarios(id),
  responsavel_nome VARCHAR(255),
  responsavel_empresa VARCHAR(255),
  local_realizacao VARCHAR(255),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_treinamentos_data ON treinamentos(data_realizacao);
CREATE INDEX idx_treinamentos_status ON treinamentos(status);
CREATE INDEX idx_treinamentos_tipo ON treinamentos(tipo);

-- RLS Policies
ALTER TABLE treinamentos ENABLE ROW LEVEL SECURITY;

-- Todos os usuários autenticados podem ver treinamentos
CREATE POLICY "Authenticated users can view trainings" ON treinamentos
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admins, RH e SST podem gerenciar treinamentos
CREATE POLICY "Admins, HR and SST can manage trainings" ON treinamentos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios u 
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'rh', 'sst')
    )
  );

CREATE TRIGGER update_treinamentos_updated_at BEFORE UPDATE ON treinamentos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
