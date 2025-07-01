-- Tabela de Treinamentos
CREATE TABLE IF NOT EXISTS public.treinamentos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  carga_horaria INT,
  validade_meses INT,
  responsavel VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.treinamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem gerenciar treinamentos da sua empresa" ON public.treinamentos
  FOR ALL USING (empresa_id = public.empresa_id());
CREATE TRIGGER handle_treinamentos_updated_at BEFORE UPDATE ON public.treinamentos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Tabela de Relação entre Treinamentos e Funcionários (Tabela de Junção)
CREATE TABLE IF NOT EXISTS public.treinamentos_funcionarios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  treinamento_id UUID NOT NULL REFERENCES public.treinamentos(id) ON DELETE CASCADE,
  funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
  data_realizacao DATE NOT NULL,
  data_vencimento DATE,
  status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.treinamentos_funcionarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem gerenciar participações em treinamentos da sua empresa" ON public.treinamentos_funcionarios
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.treinamentos t
      WHERE t.id = treinamento_id AND t.empresa_id = public.empresa_id()
    )
  );
