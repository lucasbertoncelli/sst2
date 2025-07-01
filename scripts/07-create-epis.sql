-- Tabela de EPIs
CREATE TABLE epis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  ca VARCHAR(20), -- Certificado de Aprovação
  tipo VARCHAR(100),
  quantidade INTEGER NOT NULL DEFAULT 0,
  quantidade_minima INTEGER DEFAULT 10,
  local_estoque VARCHAR(100),
  fornecedor_id UUID REFERENCES fornecedores(id) ON DELETE SET NULL,
  preco_unitario DECIMAL(10,2),
  data_ultima_compra DATE,
  observacoes TEXT,
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_epis_fornecedor ON epis(fornecedor_id);
CREATE INDEX idx_epis_quantidade ON epis(quantidade);

-- RLS Policies
ALTER TABLE epis ENABLE ROW LEVEL SECURITY;

-- Todos os usuários autenticados podem ver EPIs
CREATE POLICY "Authenticated users can view EPIs" ON epis
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admins, RH e SST podem gerenciar EPIs
CREATE POLICY "Admins, HR and SST can manage EPIs" ON epis
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios u 
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'rh', 'sst')
    )
  );

CREATE TRIGGER update_epis_updated_at BEFORE UPDATE ON epis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
