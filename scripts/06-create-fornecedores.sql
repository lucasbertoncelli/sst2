-- Tabela de fornecedores
CREATE TABLE fornecedores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  inscricao_estadual VARCHAR(20),
  telefone VARCHAR(20),
  email VARCHAR(255),
  endereco TEXT,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(10),
  contato_responsavel VARCHAR(255),
  telefone_responsavel VARCHAR(20),
  email_responsavel VARCHAR(255),
  observacoes TEXT,
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;

-- Todos os usuários autenticados podem ver fornecedores
CREATE POLICY "Authenticated users can view suppliers" ON fornecedores
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admins, RH e SST podem gerenciar fornecedores
CREATE POLICY "Admins, HR and SST can manage suppliers" ON fornecedores
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios u 
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'rh', 'sst')
    )
  );

CREATE TRIGGER update_fornecedores_updated_at BEFORE UPDATE ON fornecedores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
