-- Complete fix for turnos table schema
-- This script will ensure all required columns exist

-- First, let's check if the table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS turnos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Now add all missing columns one by one
DO $$ 
BEGIN
    -- Add empresa_id column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'turnos' AND column_name = 'empresa_id'
    ) THEN
        ALTER TABLE turnos ADD COLUMN empresa_id UUID;
        RAISE NOTICE 'Added empresa_id column to turnos table';
    END IF;
    
    -- Add dias_semana column (this is the missing one causing the error)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'turnos' AND column_name = 'dias_semana'
    ) THEN
        ALTER TABLE turnos ADD COLUMN dias_semana TEXT[] NOT NULL DEFAULT '{}';
        RAISE NOTICE 'Added dias_semana column to turnos table';
    END IF;
    
    -- Add intervalo column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'turnos' AND column_name = 'intervalo'
    ) THEN
        ALTER TABLE turnos ADD COLUMN intervalo TEXT;
        RAISE NOTICE 'Added intervalo column to turnos table';
    END IF;
    
    -- Add carga_horaria_diaria column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'turnos' AND column_name = 'carga_horaria_diaria'
    ) THEN
        ALTER TABLE turnos ADD COLUMN carga_horaria_diaria DECIMAL(4,2) NOT NULL DEFAULT 8.0;
        RAISE NOTICE 'Added carga_horaria_diaria column to turnos table';
    END IF;
    
    -- Add observacoes column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'turnos' AND column_name = 'observacoes'
    ) THEN
        ALTER TABLE turnos ADD COLUMN observacoes TEXT;
        RAISE NOTICE 'Added observacoes column to turnos table';
    END IF;
    
    -- Add ativo column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'turnos' AND column_name = 'ativo'
    ) THEN
        ALTER TABLE turnos ADD COLUMN ativo BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added ativo column to turnos table';
    END IF;
    
    -- Ensure created_at exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'turnos' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE turnos ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added created_at column to turnos table';
    END IF;
    
    -- Ensure updated_at exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'turnos' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE turnos ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to turnos table';
    END IF;
    
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_turnos_empresa_id ON turnos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_turnos_nome ON turnos(nome);
CREATE INDEX IF NOT EXISTS idx_turnos_ativo ON turnos(ativo);

-- Create or replace the update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS update_turnos_updated_at ON turnos;
CREATE TRIGGER update_turnos_updated_at
    BEFORE UPDATE ON turnos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE turnos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Usuários podem ver turnos da própria empresa" ON turnos;
DROP POLICY IF EXISTS "Usuários podem inserir turnos na própria empresa" ON turnos;
DROP POLICY IF EXISTS "Usuários podem atualizar turnos da própria empresa" ON turnos;
DROP POLICY IF EXISTS "Usuários podem deletar turnos da própria empresa" ON turnos;

-- Create RLS policies
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

-- Show the final table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'turnos' 
ORDER BY ordinal_position;
