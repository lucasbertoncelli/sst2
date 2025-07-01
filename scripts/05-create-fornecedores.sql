-- Tabela de fornecedores
CREATE TABLE fornecedores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  inscricao_estadual VARCHAR(20),
  telefone VARCHAR(20),
  email VARCHAR(255),
  endereco TEXT,
  contato_responsavel VARCHAR(255),
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_fornecedores_nome ON fornecedores(nome);
CREATE INDEX idx_fornecedores_cnpj ON fornecedores(cnpj);

-- RLS
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver fornecedores" ON fornecedores
  FOR SELECT USING (auth.role() = 'authenticated');
