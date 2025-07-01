-- Tabela de participantes do DDS
CREATE TABLE dds_participantes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dds_id UUID NOT NULL REFERENCES dds(id) ON DELETE CASCADE,
  funcionario_id UUID NOT NULL REFERENCES funcionarios(id),
  presente BOOLEAN DEFAULT true,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(dds_id, funcionario_id)
);

-- Índices
CREATE INDEX idx_dds_participantes_dds ON dds_participantes(dds_id);
CREATE INDEX idx_dds_participantes_funcionario ON dds_participantes(funcionario_id);

-- RLS
ALTER TABLE dds_participantes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver participantes DDS" ON dds_participantes
  FOR SELECT USING (auth.role() = 'authenticated');
