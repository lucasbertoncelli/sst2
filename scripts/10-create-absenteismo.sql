-- Tabela de absenteísmo
CREATE TABLE absenteismo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID NOT NULL REFERENCES funcionarios(id),
  tipo VARCHAR(100) NOT NULL,
  turno VARCHAR(50),
  cid VARCHAR(10), -- Código CID se for doença
  data_inicio DATE NOT NULL,
  data_fim DATE,
  horas_perdidas INTEGER, -- em minutos
  justificativa TEXT,
  atestado_medico BOOLEAN DEFAULT false,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_absenteismo_funcionario ON absenteismo(funcionario_id);
CREATE INDEX idx_absenteismo_tipo ON absenteismo(tipo);
CREATE INDEX idx_absenteismo_data ON absenteismo(data_inicio);

-- RLS
ALTER TABLE absenteismo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver absenteísmo" ON absenteismo
  FOR SELECT USING (auth.role() = 'authenticated');
