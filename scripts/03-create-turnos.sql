-- Tabela de turnos (versão atualizada)
CREATE TABLE IF NOT EXISTS turnos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL,
  nome VARCHAR(255) NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  dias_semana TEXT[] NOT NULL DEFAULT '{}',
  intervalo TEXT,
  carga_horaria_diaria DECIMAL(4,2) NOT NULL DEFAULT 8.0,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migração para tabelas existentes
DO $$ 
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'turnos' AND column_name = 'carga_horaria_diaria') THEN
        ALTER TABLE turnos ADD COLUMN carga_horaria_diaria DECIMAL(4,2) NOT NULL DEFAULT 8.0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'turnos' AND column_name = 'empresa_id') THEN
        ALTER TABLE turnos ADD COLUMN empresa_id UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'turnos' AND column_name = 'observacoes') THEN
        ALTER TABLE turnos ADD COLUMN observacoes TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'turnos' AND column_name = 'intervalo') THEN
        ALTER TABLE turnos ADD COLUMN intervalo TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'turnos' AND column_name = 'ativo') THEN
        ALTER TABLE turnos ADD COLUMN ativo BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'turnos' AND column_name = 'created_at') THEN
        ALTER TABLE turnos ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'turnos' AND column_name = 'updated_at') THEN
        ALTER TABLE turnos ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Índices
CREATE INDEX IF NOT EXISTS idx_turnos_empresa_id ON turnos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_turnos_nome ON turnos(nome);
CREATE INDEX IF NOT EXISTS idx_turnos_ativo ON turnos(ativo);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_turnos_updated_at ON turnos;
CREATE TRIGGER update_turnos_updated_at
    BEFORE UPDATE ON turnos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE turnos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Usuários podem ver turnos da própria empresa" ON turnos;
DROP POLICY IF EXISTS "Usuários podem inserir turnos na própria empresa" ON turnos;
DROP POLICY IF EXISTS "Usuários podem atualizar turnos da própria empresa" ON turnos;
DROP POLICY IF EXISTS "Usuários podem deletar turnos da própria empresa" ON turnos;

-- Create new policies
CREATE POLICY "Usuários podem ver turnos da própria empresa" ON turnos
  FOR SELECT USING (
    empresa_id IN (
      SELECT empresa_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem inserir turnos na própria empresa" ON turnos
  FOR INSERT WITH CHECK (
    empresa_id IN (
      SELECT empresa_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem atualizar turnos da própria empresa" ON turnos
  FOR UPDATE USING (
    empresa_id IN (
      SELECT empresa_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem deletar turnos da própria empresa" ON turnos
  FOR DELETE USING (
    empresa_id IN (
      SELECT empresa_id FROM profiles WHERE id = auth.uid()
    )
  );
