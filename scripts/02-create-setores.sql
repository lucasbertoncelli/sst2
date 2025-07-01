-- Tabela de setores
CREATE TABLE setores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_setores_nome ON setores(nome);

-- RLS
ALTER TABLE setores ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura para usuários autenticados
CREATE POLICY "Usuários autenticados podem ver setores" ON setores
  FOR SELECT USING (auth.role() = 'authenticated');
