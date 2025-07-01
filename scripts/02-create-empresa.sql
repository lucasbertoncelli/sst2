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
  endereco_completo TEXT,
  bairro VARCHAR(100),
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  cep VARCHAR(10),
  responsavel_legal VARCHAR(255),
  telefone_responsavel VARCHAR(20),
  email_responsavel VARCHAR(255),
  logo_url TEXT,
  logo_base64 TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE empresa ENABLE ROW LEVEL SECURITY;

-- Todos os usuários autenticados podem ver dados da empresa
CREATE POLICY "Authenticated users can view company data" ON empresa
  FOR SELECT USING (auth.role() = 'authenticated');

-- Apenas admins podem modificar dados da empresa
CREATE POLICY "Only admins can modify company data" ON empresa
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios u 
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE TRIGGER update_empresa_updated_at BEFORE UPDATE ON empresa
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
