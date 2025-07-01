-- Tabela de DDS (Diálogos Diários de Segurança)
CREATE TABLE dds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tema VARCHAR(255) NOT NULL,
  descricao TEXT,
  data_realizacao DATE NOT NULL DEFAULT CURRENT_DATE,
  hora_realizacao TIME,
  local_realizacao VARCHAR(255),
  responsavel VARCHAR(255) NOT NULL,
  responsavel_id UUID REFERENCES funcionarios(id),
  setor_id UUID REFERENCES setores(id),
  duracao_minutos INTEGER,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de participantes do DDS
CREATE TABLE dds_participantes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dds_id UUID NOT NULL REFERENCES dds(id) ON DELETE CASCADE,
  funcionario_id UUID NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  presente BOOLEAN DEFAULT true,
  assinatura_url TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(dds_id, funcionario_id)
);

-- Índices para performance
CREATE INDEX idx_dds_data ON dds(data_realizacao);
CREATE INDEX idx_dds_responsavel ON dds(responsavel_id);
CREATE INDEX idx_dds_setor ON dds(setor_id);
CREATE INDEX idx_dds_participantes_dds ON dds_participantes(dds_id);
CREATE INDEX idx_dds_participantes_funcionario ON dds_participantes(funcionario_id);

-- RLS Policies para DDS
ALTER TABLE dds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view DDS" ON dds
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins, HR and SST can manage DDS" ON dds
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios u 
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'rh', 'sst')
    )
  );

-- RLS Policies para participantes do DDS
ALTER TABLE dds_participantes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view DDS participants" ON dds_participantes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins, HR and SST can manage DDS participants" ON dds_participantes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios u 
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'rh', 'sst')
    )
  );

CREATE TRIGGER update_dds_updated_at BEFORE UPDATE ON dds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
