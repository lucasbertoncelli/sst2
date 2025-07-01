-- Tabela de relacionamento entre treinamentos e funcionários
CREATE TABLE rel_treinamentos_funcionarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  treinamento_id UUID NOT NULL REFERENCES treinamentos(id) ON DELETE CASCADE,
  data_realizacao DATE,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'concluido', 'faltou', 'cancelado')),
  nota DECIMAL(4,2),
  certificado_url TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(funcionario_id, treinamento_id)
);

-- Índices para performance
CREATE INDEX idx_rel_treinamentos_funcionario ON rel_treinamentos_funcionarios(funcionario_id);
CREATE INDEX idx_rel_treinamentos_treinamento ON rel_treinamentos_funcionarios(treinamento_id);
CREATE INDEX idx_rel_treinamentos_status ON rel_treinamentos_funcionarios(status);

-- RLS Policies
ALTER TABLE rel_treinamentos_funcionarios ENABLE ROW LEVEL SECURITY;

-- Todos os usuários autenticados podem ver relacionamentos de treinamentos
CREATE POLICY "Authenticated users can view training relationships" ON rel_treinamentos_funcionarios
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admins, RH e SST podem gerenciar relacionamentos de treinamentos
CREATE POLICY "Admins, HR and SST can manage training relationships" ON rel_treinamentos_funcionarios
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios u 
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'rh', 'sst')
    )
  );

CREATE TRIGGER update_rel_treinamentos_funcionarios_updated_at BEFORE UPDATE ON rel_treinamentos_funcionarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
