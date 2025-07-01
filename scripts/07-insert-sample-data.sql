-- Inserir empresa exemplo
INSERT INTO public.empresas (id, nome, cnpj, endereco, telefone, email, responsavel_sst) 
VALUES (
  uuid_generate_v4(),
  'Empresa Exemplo Ltda',
  '12.345.678/0001-90',
  'Rua das Empresas, 123 - Centro',
  '(11) 1234-5678',
  'contato@empresaexemplo.com',
  'João Silva'
) ON CONFLICT DO NOTHING;

-- Obter ID da empresa para usar nas próximas inserções
DO $$
DECLARE
  empresa_id UUID;
BEGIN
  SELECT id INTO empresa_id FROM public.empresas LIMIT 1;
  
  -- Inserir setores
  INSERT INTO public.setores (nome, descricao, empresa_id) VALUES
    ('Administração', 'Setor administrativo', empresa_id),
    ('Produção', 'Setor de produção', empresa_id),
    ('Manutenção', 'Setor de manutenção', empresa_id),
    ('Qualidade', 'Controle de qualidade', empresa_id)
  ON CONFLICT DO NOTHING;
  
  -- Inserir turnos
  INSERT INTO public.turnos (nome, hora_inicio, hora_fim, empresa_id) VALUES
    ('Manhã', '07:00', '15:00', empresa_id),
    ('Tarde', '15:00', '23:00', empresa_id),
    ('Noite', '23:00', '07:00', empresa_id),
    ('Administrativo', '08:00', '17:00', empresa_id)
  ON CONFLICT DO NOTHING;
  
  -- Inserir fornecedores
  INSERT INTO public.fornecedores (nome, cnpj, telefone, email, contato, empresa_id) VALUES
    ('EPI Segurança Ltda', '98.765.432/0001-10', '(11) 9876-5432', 'vendas@episeguranca.com', 'Maria Santos', empresa_id),
    ('Proteção Total', '11.222.333/0001-44', '(11) 1111-2222', 'contato@protecaototal.com', 'Pedro Oliveira', empresa_id)
  ON CONFLICT DO NOTHING;
  
  -- Inserir EPIs exemplo
  INSERT INTO public.epis (nome, descricao, ca, tipo, quantidade, quantidade_minima, preco_unitario, empresa_id) VALUES
    ('Capacete de Segurança', 'Capacete classe A', '12345', 'Proteção da cabeça', 50, 10, 25.90, empresa_id),
    ('Óculos de Proteção', 'Óculos contra impactos', '23456', 'Proteção dos olhos', 30, 5, 15.50, empresa_id),
    ('Luvas de Segurança', 'Luvas de vaqueta', '34567', 'Proteção das mãos', 100, 20, 8.75, empresa_id),
    ('Botina de Segurança', 'Botina com bico de aço', '45678', 'Proteção dos pés', 25, 5, 89.90, empresa_id)
  ON CONFLICT DO NOTHING;
  
  -- Inserir treinamentos exemplo
  INSERT INTO public.treinamentos (nome, descricao, tipo, carga_horaria, validade_meses, instrutor, empresa_id) VALUES
    ('Integração de Segurança', 'Treinamento admissional de segurança', 'admissional', 4, 12, 'João Silva', empresa_id),
    ('Uso de EPIs', 'Treinamento sobre uso correto de EPIs', 'periodico', 2, 6, 'Maria Santos', empresa_id),
    ('Primeiros Socorros', 'Treinamento de primeiros socorros', 'especifico', 8, 24, 'Dr. Pedro', empresa_id),
    ('Prevenção de Acidentes', 'CIPA - Prevenção de acidentes', 'periodico', 20, 12, 'Ana Costa', empresa_id)
  ON CONFLICT DO NOTHING;
  
END $$;
