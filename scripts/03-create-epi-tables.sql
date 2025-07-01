-- Tabela de Fornecedores
CREATE TABLE IF NOT EXISTS public.fornecedores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  contato VARCHAR(255),
  telefone VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem gerenciar fornecedores da sua empresa" ON public.fornecedores
  FOR ALL USING (empresa_id = public.empresa_id());
CREATE TRIGGER handle_fornecedores_updated_at BEFORE UPDATE ON public.fornecedores FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Tabela de Equipamentos de Proteção Individual (EPIs)
CREATE TABLE IF NOT EXISTS public.epis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  ca VARCHAR(50) UNIQUE,
  validade_ca DATE,
  estoque_minimo INT,
  estoque_atual INT,
  unidade_medida VARCHAR(50),
  fornecedor_id UUID REFERENCES public.fornecedores(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.epis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem gerenciar EPIs da sua empresa" ON public.epis
  FOR ALL USING (empresa_id = public.empresa_id());
CREATE TRIGGER handle_epis_updated_at BEFORE UPDATE ON public.epis FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Tabela de Entrega de EPIs
CREATE TABLE IF NOT EXISTS public.entrega_epis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
  epi_id UUID NOT NULL REFERENCES public.epis(id) ON DELETE CASCADE,
  data_entrega DATE NOT NULL,
  quantidade INT NOT NULL,
  data_devolucao DATE,
  observacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.entrega_epis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem gerenciar entregas de EPIs da sua empresa" ON public.entrega_epis
  FOR ALL USING (empresa_id = public.empresa_id());
CREATE TRIGGER handle_entrega_epis_updated_at BEFORE UPDATE ON public.entrega_epis FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
