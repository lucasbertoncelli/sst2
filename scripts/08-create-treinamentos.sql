-- Tabela de treinamentos
CREATE TABLE treinamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(100) NOT NULL,
  carga_horaria INTEGER, -- em minutos
  data_realizacao DATE,
  data_validade DATE,
  status VARCHAR(50) DEFAULT 'planejado' CHECK (status IN ('planejado', 'em_andamento', 'concluido', 'cancelado')),
  responsavel_tipo VARCHAR(50) CHECK (responsavel_tipo IN ('interno', 'externo')),
  responsavel_nome VARCHAR(255),
  responsavel_empresa VARCHAR(255),
  local_realizacao VARCHAR(255),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_treinamentos_titulo ON treinamentos(titulo);
CREATE INDEX idx_treinamentos_tipo ON treinamentos(tipo);
CREATE INDEX idx_treinamentos_data ON treinamentos(data_realizacao);

-- RLS
ALTER TABLE treinamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver treinamentos" ON treinamentos
  FOR SELECT USING (auth.role() = 'authenticated');
