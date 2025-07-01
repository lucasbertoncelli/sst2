-- Tabela de relacionamento entre treinamentos e funcionários
CREATE TABLE rel_treinamentos_funcionarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID NOT NULL REFERENCES funcionarios(id),
  treinamento_id UUID NOT NULL REFERENCES treinamentos(id),
  data_realizacao DATE,
  status VARCHAR(50) DEFAULT 'inscrito' CHECK (status IN ('inscrito', 'presente', 'ausente', 'aprovado', 'reprovado')),
  nota DECIMAL(5,2),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(funcionario_id, treinamento_id)
);

-- Índices
CREATE INDEX idx_rel_trein_func_funcionario ON rel_treinamentos_funcionarios(funcionario_id);
CREATE INDEX idx_rel_trein_func_treinamento ON rel_treinamentos_funcionarios(treinamento_id);

-- RLS
ALTER TABLE rel_treinamentos_funcionarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver relação treinamentos" ON rel_treinamentos_funcionarios
  FOR SELECT USING (auth.role() = 'authenticated');
