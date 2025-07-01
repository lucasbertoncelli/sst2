-- Tabela de absenteísmo
CREATE TABLE absenteismo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Atestado Médico', 'Falta Justificada', 'Falta Injustificada', 'Licença Médica', 'Acidente de Trabalho')),
  turno VARCHAR(50),
  cid VARCHAR(10), -- Código CID quando aplicável
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  horas_perdidas INTEGER,
  justificativa TEXT,
  atestado_url TEXT,
  aprovado_por UUID REFERENCES usuarios(id),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (data_fim >= data_inicio)
);

-- Índices para performance
CREATE INDEX idx_absenteismo_funcionario ON absenteismo(funcionario_id);
CREATE INDEX idx_absenteismo_data_inicio ON absenteismo(data_inicio);
CREATE INDEX idx_absenteismo_tipo ON absenteismo(tipo);
CREATE INDEX idx_absenteismo_cid ON absenteismo(cid);

-- RLS Policies
ALTER TABLE absenteismo ENABLE ROW LEVEL SECURITY;

-- Todos os usuários autenticados podem ver absenteísmo
CREATE POLICY "Authenticated users can view absenteeism" ON absenteismo
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admins, RH e SST podem gerenciar absenteísmo
CREATE POLICY "Admins, HR and SST can manage absenteeism" ON absenteismo
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios u 
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'rh', 'sst')
    )
  );

-- Trigger para calcular horas perdidas automaticamente
CREATE OR REPLACE FUNCTION calculate_lost_hours()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.horas_perdidas IS NULL THEN
    -- Calcula horas perdidas baseado nos dias e carga horária padrão
    NEW.horas_perdidas := (NEW.data_fim - NEW.data_inicio + 1) * 8;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_lost_hours
  BEFORE INSERT OR UPDATE ON absenteismo
  FOR EACH ROW EXECUTE FUNCTION calculate_lost_hours();

CREATE TRIGGER update_absenteismo_updated_at BEFORE UPDATE ON absenteismo
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
