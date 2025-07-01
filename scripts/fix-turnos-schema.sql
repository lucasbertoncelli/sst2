-- Fix turnos table schema - add missing columns
DO $$ 
BEGIN
    -- Add carga_horaria_diaria column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'turnos' AND column_name = 'carga_horaria_diaria'
    ) THEN
        ALTER TABLE turnos ADD COLUMN carga_horaria_diaria DECIMAL(4,2) NOT NULL DEFAULT 8.0;
        RAISE NOTICE 'Added carga_horaria_diaria column to turnos table';
    END IF;
    
    -- Add empresa_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'turnos' AND column_name = 'empresa_id'
    ) THEN
        ALTER TABLE turnos ADD COLUMN empresa_id UUID;
        RAISE NOTICE 'Added empresa_id column to turnos table';
    END IF;
    
    -- Add observacoes column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'turnos' AND column_name = 'observacoes'
    ) THEN
        ALTER TABLE turnos ADD COLUMN observacoes TEXT;
        RAISE NOTICE 'Added observacoes column to turnos table';
    END IF;
    
    -- Add intervalo column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'turnos' AND column_name = 'intervalo'
    ) THEN
        ALTER TABLE turnos ADD COLUMN intervalo TEXT;
        RAISE NOTICE 'Added intervalo column to turnos table';
    END IF;
    
    -- Add ativo column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'turnos' AND column_name = 'ativo'
    ) THEN
        ALTER TABLE turnos ADD COLUMN ativo BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added ativo column to turnos table';
    END IF;
    
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'turnos' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE turnos ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added created_at column to turnos table';
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'turnos' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE turnos ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to turnos table';
    END IF;
    
    -- Update dias_semana column type if needed
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'turnos' AND column_name = 'dias_semana' AND data_type = 'ARRAY'
    ) THEN
        -- Check if it's INTEGER[] and convert to TEXT[]
        BEGIN
            ALTER TABLE turnos ALTER COLUMN dias_semana TYPE TEXT[] USING dias_semana::TEXT[];
            RAISE NOTICE 'Updated dias_semana column type to TEXT[]';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'dias_semana column type conversion skipped or already correct';
        END;
    END IF;
    
END $$;

-- Create indexes if they don't exist
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

-- Enable RLS if not already enabled
ALTER TABLE turnos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Usuários podem ver turnos da própria empresa" ON turnos;
DROP POLICY IF EXISTS "Usuários podem inserir turnos na própria empresa" ON turnos;
DROP POLICY IF EXISTS "Usuários podem atualizar turnos da própria empresa" ON turnos;
DROP POLICY IF EXISTS "Usuários podem deletar turnos da própria empresa" ON turnos;

-- Create new RLS policies
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

-- Show final table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'turnos' 
ORDER BY ordinal_position;
