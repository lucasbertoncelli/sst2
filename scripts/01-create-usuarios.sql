-- Tabela de usuários do sistema
CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'rh', 'sst', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Admins podem ver e gerenciar todos os usuários
CREATE POLICY "Admins can manage all users" ON usuarios
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios u 
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Usuários podem ver apenas seus próprios dados
CREATE POLICY "Users can view own data" ON usuarios
  FOR SELECT USING (id = auth.uid());

-- Usuários podem atualizar apenas seus próprios dados (exceto role)
CREATE POLICY "Users can update own data" ON usuarios
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM usuarios WHERE id = auth.uid()));

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
