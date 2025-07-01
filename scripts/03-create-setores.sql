-- Tabela de setores
CREATE TABLE setores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE setores ENABLE ROW LEVEL SECURITY;

-- Todos os usuários autenticados podem ver setores
CREATE POLICY "Authenticated users can view sectors" ON setores
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admins e RH podem gerenciar setores
CREATE POLICY "Admins and HR can manage sectors" ON setores
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios u 
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'rh')
    )
  );

CREATE TRIGGER update_setores_updated_at BEFORE UPDATE ON setores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
