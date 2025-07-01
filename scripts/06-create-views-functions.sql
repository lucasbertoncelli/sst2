-- View de funcionários com informações completas
CREATE OR REPLACE VIEW public.vw_funcionarios_completo AS
SELECT 
  f.*,
  s.nome as setor_nome,
  t.nome as turno_nome,
  t.hora_inicio,
  t.hora_fim,
  e.nome as empresa_nome
FROM public.funcionarios f
LEFT JOIN public.setores s ON f.setor_id = s.id
LEFT JOIN public.turnos t ON f.turno_id = t.id
LEFT JOIN public.empresas e ON f.empresa_id = e.id;

-- View de EPIs com estoque baixo
CREATE OR REPLACE VIEW public.vw_epis_estoque_baixo AS
SELECT 
  e.*,
  f.nome as fornecedor_nome,
  f.telefone as fornecedor_telefone,
  emp.nome as empresa_nome
FROM public.epis e
LEFT JOIN public.fornecedores f ON e.fornecedor_id = f.id
LEFT JOIN public.empresas emp ON e.empresa_id = emp.id
WHERE e.quantidade <= e.quantidade_minima;

-- View de treinamentos vencidos ou próximos do vencimento
CREATE OR REPLACE VIEW public.vw_treinamentos_vencimento AS
SELECT 
  tf.*,
  t.nome as treinamento_nome,
  t.tipo as treinamento_tipo,
  f.nome as funcionario_nome,
  f.cargo,
  s.nome as setor_nome,
  CASE 
    WHEN tf.data_vencimento < CURRENT_DATE THEN 'vencido'
    WHEN tf.data_vencimento <= CURRENT_DATE + INTERVAL '30 days' THEN 'proximo_vencimento'
    ELSE 'valido'
  END as status_validade,
  CURRENT_DATE - tf.data_vencimento as dias_vencido
FROM public.treinamentos_funcionarios tf
JOIN public.treinamentos t ON tf.treinamento_id = t.id
JOIN public.funcionarios f ON tf.funcionario_id = f.id
LEFT JOIN public.setores s ON f.setor_id = s.id
WHERE tf.status = 'concluido';

-- Função para calcular taxa de absenteísmo por período
CREATE OR REPLACE FUNCTION public.calcular_taxa_absenteismo(
  data_inicio DATE,
  data_fim DATE,
  setor_id_param UUID DEFAULT NULL
)
RETURNS TABLE(
  setor_nome TEXT,
  total_funcionarios BIGINT,
  total_ausencias BIGINT,
  dias_ausencia BIGINT,
  taxa_absenteismo DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(s.nome, 'Todos os setores') as setor_nome,
    COUNT(DISTINCT f.id) as total_funcionarios,
    COUNT(a.id) as total_ausencias,
    COALESCE(SUM(a.dias_ausencia), 0) as dias_ausencia,
    CASE 
      WHEN COUNT(DISTINCT f.id) > 0 THEN 
        ROUND((COALESCE(SUM(a.dias_ausencia), 0)::DECIMAL / (COUNT(DISTINCT f.id) * (data_fim - data_inicio + 1))) * 100, 2)
      ELSE 0
    END as taxa_absenteismo
  FROM public.funcionarios f
  LEFT JOIN public.setores s ON f.setor_id = s.id
  LEFT JOIN public.absenteismo a ON f.id = a.funcionario_id 
    AND a.data_inicio BETWEEN calcular_taxa_absenteismo.data_inicio AND calcular_taxa_absenteismo.data_fim
  WHERE (setor_id_param IS NULL OR f.setor_id = setor_id_param)
    AND f.status = 'ativo'
  GROUP BY s.nome;
END;
$$ LANGUAGE plpgsql;

-- Função para relatório de acidentes por período
CREATE OR REPLACE FUNCTION public.relatorio_acidentes(
  data_inicio DATE,
  data_fim DATE
)
RETURNS TABLE(
  mes TEXT,
  total_acidentes BIGINT,
  acidentes_leves BIGINT,
  acidentes_moderados BIGINT,
  acidentes_graves BIGINT,
  acidentes_fatais BIGINT,
  dias_afastamento BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(ac.data_acidente, 'YYYY-MM') as mes,
    COUNT(*) as total_acidentes,
    COUNT(*) FILTER (WHERE ac.gravidade = 'leve') as acidentes_leves,
    COUNT(*) FILTER (WHERE ac.gravidade = 'moderada') as acidentes_moderados,
    COUNT(*) FILTER (WHERE ac.gravidade = 'grave') as acidentes_graves,
    COUNT(*) FILTER (WHERE ac.gravidade = 'fatal') as acidentes_fatais,
    COALESCE(SUM(ac.tempo_afastamento), 0) as dias_afastamento
  FROM public.acidentes ac
  WHERE ac.data_acidente BETWEEN relatorio_acidentes.data_inicio AND relatorio_acidentes.data_fim
  GROUP BY TO_CHAR(ac.data_acidente, 'YYYY-MM')
  ORDER BY mes;
END;
$$ LANGUAGE plpgsql;

-- Função para dashboard de EPIs
CREATE OR REPLACE FUNCTION public.dashboard_epis()
RETURNS TABLE(
  total_epis BIGINT,
  epis_estoque_baixo BIGINT,
  total_entregas_mes BIGINT,
  valor_estoque DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.epis) as total_epis,
    (SELECT COUNT(*) FROM public.epis WHERE quantidade <= quantidade_minima) as epis_estoque_baixo,
    (SELECT COUNT(*) FROM public.entrega_epis WHERE data_entrega >= DATE_TRUNC('month', CURRENT_DATE)) as total_entregas_mes,
    (SELECT COALESCE(SUM(quantidade * preco_unitario), 0) FROM public.epis) as valor_estoque;
END;
$$ LANGUAGE plpgsql;
