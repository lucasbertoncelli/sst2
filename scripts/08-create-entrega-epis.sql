-- Tabela de entregas de EPIs
CREATE TABLE entrega_epis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  epi_id UUID NOT NULL REFERENCES epis(id) ON DELETE CASCADE,
  ca VARCHAR(20),
  data_entrega DATE NOT NULL DEFAULT CURRENT_DATE,
  data_fabricacao DATE,
  validade DATE,
  quantidade INTEGER NOT NULL DEFAULT 1,
  observacoes TEXT,
  entregue_por UUID REFERENCES usuarios(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_entrega_epis_funcionario ON entrega_epis(funcionario_id);
CREATE INDEX idx_entrega_epis_epi ON entrega_epis(epi_id);
CREATE INDEX idx_entrega_epis_data ON entrega_epis(data_entrega);

-- RLS Policies
ALTER TABLE entrega_epis ENABLE ROW LEVEL SECURITY;

-- Todos os usuários autenticados podem ver entregas de EPIs
CREATE POLICY "Authenticated users can view EPI deliveries" ON entrega_epis
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admins, RH e SST podem gerenciar entregas de EPIs
CREATE POLICY "Admins, HR and SST can manage EPI deliveries" ON entrega_epis
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios u 
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'rh', 'sst')
    )
  );

-- Trigger para atualizar estoque quando EPI é entregue
CREATE OR REPLACE FUNCTION update_epi_stock_on_delivery()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Diminui o estoque quando EPI é entregue
    UPDATE epis 
    SET quantidade = quantidade - NEW.quantidade
    WHERE id = NEW.epi_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Aumenta o estoque quando entrega é cancelada
    UPDATE epis 
    SET quantidade = quantidade + OLD.quantidade
    WHERE id = OLD.epi_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_epi_stock
  AFTER INSERT OR DELETE ON entrega_epis
  FOR EACH ROW EXECUTE FUNCTION update_epi_stock_on_delivery();

CREATE TRIGGER update_entrega_epis_updated_at BEFORE UPDATE ON entrega_epis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
