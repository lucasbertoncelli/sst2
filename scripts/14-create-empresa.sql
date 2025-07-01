-- Tabela de dados da empresa
CREATE TABLE empresa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255),
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  inscricao_estadual VARCHAR(20),
  inscricao_municipal VARCHAR(20),
  telefone VARCHAR(20),
  email VARCHAR(255),
  site VARCHAR(255),
  endereco TEXT,
  cep VARCHAR(10),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  responsavel_sst VARCHAR(255),
  crea_responsavel VARCHAR(20),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE empresa ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver dados da empresa" ON empresa
  FOR SELECT USING (auth.role() = 'authenticated');
