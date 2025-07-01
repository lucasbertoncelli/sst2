-- Tabela de entrega de EPIs
CREATE TABLE entrega_epis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID NOT NULL REFERENCES funcionarios(id),
  epi_id UUID NOT NULL REFERENCES epis(id),
  quantidade INTEGER NOT NULL DEFAULT 1,
  ca VARCHAR(20),
  data_fabricacao DATE,
  data_validade DATE,
  data_entrega DATE NOT NULL DEFAULT CURRENT_DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_entrega_epis_funcionario ON entrega_epis(funcionario_id);
CREATE INDEX idx_entrega_epis_epi ON entrega_epis(epi_id);
CREATE INDEX idx_entrega_epis_data ON entrega_epis(data_entrega);

-- RLS
ALTER TABLE entrega_epis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver entregas de EPIs" ON entrega_epis
  FOR SELECT USING (auth.role() = 'authenticated');
