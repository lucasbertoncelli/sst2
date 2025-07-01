-- Tabela de DDS (Diálogo Diário de Segurança)
CREATE TABLE dds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tema VARCHAR(255) NOT NULL,
  descricao TEXT,
  responsavel VARCHAR(255) NOT NULL,
  data_realizacao DATE NOT NULL,
  local_realizacao VARCHAR(255),
  duracao INTEGER, -- em minutos
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_dds_tema ON dds(tema);
CREATE INDEX idx_dds_data ON dds(data_realizacao);
CREATE INDEX idx_dds_responsavel ON dds(responsavel);

-- RLS
ALTER TABLE dds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver DDS" ON dds
  FOR SELECT USING (auth.role() = 'authenticated');
