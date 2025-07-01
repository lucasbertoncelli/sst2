-- Tabela de acidentes
CREATE TABLE acidentes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID NOT NULL REFERENCES funcionarios(id),
  tipo VARCHAR(100) NOT NULL,
  cid VARCHAR(10),
  gravidade VARCHAR(50) CHECK (gravidade IN ('leve', 'moderado', 'grave', 'fatal')),
  data_ocorrencia DATE NOT NULL,
  hora_ocorrencia TIME,
  local_ocorrencia VARCHAR(255),
  descricao TEXT NOT NULL,
  causa_provavel TEXT,
  tempo_afastamento INTEGER DEFAULT 0, -- em dias
  parte_corpo_atingida VARCHAR(255),
  testemunhas TEXT,
  medidas_tomadas TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_acidentes_funcionario ON acidentes(funcionario_id);
CREATE INDEX idx_acidentes_tipo ON acidentes(tipo);
CREATE INDEX idx_acidentes_data ON acidentes(data_ocorrencia);
CREATE INDEX idx_acidentes_gravidade ON acidentes(gravidade);

-- RLS
ALTER TABLE acidentes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver acidentes" ON acidentes
  FOR SELECT USING (auth.role() = 'authenticated');
