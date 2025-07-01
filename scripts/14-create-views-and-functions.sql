-- Views úteis para relatórios e dashboards

-- View de funcionários com informações completas
CREATE OR REPLACE VIEW vw_funcionarios_completo AS
SELECT 
  f.*,
  s.nome as setor_nome,
  t.nome as turno_nome,
  t.hora_inicio,
  t.hora_fim
FROM funcionarios f
LEFT JOIN setores s ON f.setor_id = s.id
LEFT JOIN turnos t ON f.turno_id = t.id;

-- View de EPIs com estoque baixo
CREATE OR REPLACE VIEW vw_epis_estoque_baixo AS
SELECT 
  e.*,
  fo.nome as fornecedor_nome,
  fo.telefone as fornecedor_telefone
FROM epis e
LEFT JOIN fornecedores fo ON e.fornecedor_id = fo.id
WHERE e.quantidade <= e.quantidade_minima;

-- View de treinamentos vencidos ou próximos do vencimento
CREATE OR REPLACE VIEW vw_treinamentos_vencimento AS
SELECT 
  t.*,
  rtf.funcionario_id,
  f.nome as funcionario_nome,
  f.cargo,
  s.nome as setor_nome,
  CASE 
    WHEN t.validade < CURRENT_DATE THEN 'Vencido'
    WHEN t.validade <= CURRENT_DATE + INTERVAL '30 days' THEN 'Próximo do vencimento'
    ELSE 'Válido'
  END as status_validade
FROM treinamentos t
JOIN rel_treinamentos_funcionarios rtf ON t.id = rtf.treinamento_id
JOIN funcionarios f ON rtf.funcionario_id = f.id
LEFT JOIN setores s ON f.setor_id = s.id
WHERE rtf.status = 'concluido';

-- Função para calcular taxa de absenteísmo por período
CREATE OR REPLACE FUNCTION calcular_taxa_absenteismo(
  data_inicio DATE,
  data_fim DATE,
  setor_id_param UUID DEFAULT NULL
)
RETURNS TABLE(
  setor_nome VARCHAR,
  total_funcionarios BIGINT,
  total_ausencias BIGINT,
  horas_perdidas BIGINT,
  taxa_absenteismo DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(s.nome, 'Todos os setores') as setor_nome,
    COUNT(DISTINCT f.id) as total_funcionarios,
    COUNT(a.id) as total_ausencias,
    COALESCE(SUM(a.horas_perdidas), 0) as horas_perdidas,
    CASE 
      WHEN COUNT(DISTINCT f.id) > 0 THEN 
        ROUND((COUNT(a.id)::DECIMAL / COUNT(DISTINCT f.id)) * 100, 2)
      ELSE 0
    END as taxa_absenteismo
  FROM funcionarios f
  LEFT JOIN setores s ON f.setor_id = s.id
  LEFT JOIN absenteismo a ON f.id = a.funcionario_id 
    AND a.data_inicio BETWEEN data_inicio AND data_fim
  WHERE (setor_id_param IS NULL OR f.setor_id = setor_id_param)
    AND f.status = 'ativo'
  GROUP BY s.nome;
END;
$$ LANGUAGE plpgsql;

-- Função para relatório de acidentes por período
CREATE OR REPLACE FUNCTION relatorio_acidentes(
  data_inicio DATE,
  data_fim DATE
)
RETURNS TABLE(
  mes VARCHAR,
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
    COUNT(*) FILTER (WHERE ac.gravidade = 'Leve') as acidentes_leves,
    COUNT(*) FILTER (WHERE ac.gravidade = 'Moderada') as acidentes_moderados,
    COUNT(*) FILTER (WHERE ac.gravidade = 'Grave') as acidentes_graves,
    COUNT(*) FILTER (WHERE ac.gravidade = 'Fatal') as acidentes_fatais,
    COALESCE(SUM(ac.tempo_afastamento), 0) as dias_afastamento
  FROM acidentes ac
  WHERE ac.data_acidente BETWEEN data_inicio AND data_fim
  GROUP BY TO_CHAR(ac.data_acidente, 'YYYY-MM')
  ORDER BY mes;
END;
$$ LANGUAGE plpgsql;
