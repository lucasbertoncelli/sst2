-- Tabela de Absenteísmo
CREATE TABLE IF NOT EXISTS public.absenteismo (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  motivo TEXT,
  cid VARCHAR(10),
  atestado_medico BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.absenteismo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem gerenciar absenteísmo da sua empresa" ON public.absenteismo
  FOR ALL USING (empresa_id = public.empresa_id());
CREATE TRIGGER handle_absenteismo_updated_at BEFORE UPDATE ON public.absenteismo FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Tabela de Acidentes de Trabalho
CREATE TABLE IF NOT EXISTS public.acidentes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
  data_acidente TIMESTAMP WITH TIME ZONE NOT NULL,
  local_acidente TEXT,
  descricao TEXT,
  cat_emitida BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.acidentes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem gerenciar acidentes da sua empresa" ON public.acidentes
  FOR ALL USING (empresa_id = public.empresa_id());
CREATE TRIGGER handle_acidentes_updated_at BEFORE UPDATE ON public.acidentes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Tabela de Diálogo Diário de Segurança (DDS)
CREATE TABLE IF NOT EXISTS public.dds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  tema TEXT NOT NULL,
  responsavel VARCHAR(255),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.dds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem gerenciar DDS da sua empresa" ON public.dds
  FOR ALL USING (empresa_id = public.empresa_id());
CREATE TRIGGER handle_dds_updated_at BEFORE UPDATE ON public.dds FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Tabela de Participantes do DDS (Tabela de Junção)
CREATE TABLE IF NOT EXISTS public.dds_participantes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  dds_id UUID NOT NULL REFERENCES public.dds(id) ON DELETE CASCADE,
  funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.dds_participantes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem gerenciar participantes de DDS da sua empresa" ON public.dds_participantes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.dds d
      WHERE d.id = dds_id AND d.empresa_id = public.empresa_id()
    )
  );
