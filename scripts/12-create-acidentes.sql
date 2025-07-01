-- Tabela de acidentes
CREATE TABLE acidentes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  tipo VARCHAR(100) NOT NULL,
  cid VARCHAR(10), -- Código CID
  gravidade VARCHAR(20) NOT NULL CHECK (gravidade IN ('Leve', 'Moderada', 'Grave', 'Fatal')),
  data_acidente DATE NOT NULL,
  hora_acidente TIME,
  local_acidente VARCHAR(255),
  descricao TEXT NOT NULL,
  causas TEXT,
  medidas_tomadas TEXT,
  tempo_afastamento INTEGER DEFAULT 0, -- em dias
  custo_estimado DECIMAL(10,2),
  testemunhas TEXT,
  investigado_por UUID REFERENCES usuarios(id),
  data_investigacao DATE,
  status VARCHAR(20) DEFAULT 'aberto' CHECK (status IN ('aberto', 'investigando', 'fechado')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_acidentes_funcionario ON acidentes(funcionario_id);
CREATE INDEX idx_acidentes_data ON acidentes(data_acidente);
CREATE INDEX idx_acidentes_gravidade ON acidentes(gravidade);
CREATE INDEX idx_acidentes_status ON acidentes(status);

-- RLS Policies
ALTER TABLE acidentes ENABLE ROW LEVEL SECURITY;

-- Todos os usuários autenticados podem ver acidentes
CREATE POLICY "Authenticated users can view accidents" ON acidentes
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admins, RH e SST podem gerenciar acidentes
CREATE POLICY "Admins, HR and SST can manage accidents" ON acidentes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios u 
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'rh', 'sst')
    )
  );

CREATE TRIGGER update_acidentes_updated_at BEFORE UPDATE ON acidentes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
