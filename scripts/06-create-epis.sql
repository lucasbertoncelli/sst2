-- Tabela de EPIs
CREATE TABLE epis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  ca VARCHAR(20), -- Certificado de Aprovação
  tipo VARCHAR(100),
  quantidade_estoque INTEGER DEFAULT 0,
  quantidade_minima INTEGER DEFAULT 0,
  local_estoque VARCHAR(255),
  fornecedor_id UUID REFERENCES fornecedores(id),
  valor_unitario DECIMAL(10,2),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_epis_nome ON epis(nome);
CREATE INDEX idx_epis_ca ON epis(ca);
CREATE INDEX idx_epis_fornecedor ON epis(fornecedor_id);

-- RLS
ALTER TABLE epis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver EPIs" ON epis
  FOR SELECT USING (auth.role() = 'authenticated');
