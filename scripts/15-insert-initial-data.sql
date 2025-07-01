-- Inserir dados iniciais

-- Inserir setores
INSERT INTO setores (nome, descricao) VALUES
('Produção', 'Setor responsável pela produção'),
('Qualidade', 'Setor de controle de qualidade'),
('Manutenção', 'Setor de manutenção de equipamentos'),
('Administração', 'Setor administrativo'),
('Logística', 'Setor de logística e armazenamento');

-- Inserir turnos
INSERT INTO turnos (nome, hora_inicio, hora_fim, dias_semana, intervalo, carga_horaria_diaria, observacoes) VALUES
('Manhã', '06:00', '14:00', ARRAY['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'], '09:00-09:15, 12:00-13:00', 8, 'Turno padrão da manhã'),
('Tarde', '14:00', '22:00', ARRAY['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'], '17:00-17:15, 19:00-20:00', 8, 'Turno da tarde'),
('Noite', '22:00', '06:00', ARRAY['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'], '02:00-02:15, 04:00-05:00', 8, 'Turno noturno'),
('Administrativo', '08:00', '17:00', ARRAY['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'], '12:00-13:00', 8, 'Horário administrativo');

-- Inserir fornecedores
INSERT INTO fornecedores (nome, cnpj, telefone, email, status) VALUES
('Fornecedor Alpha', '12.345.678/0001-90', '(11) 3456-7890', 'contato@alpha.com', 'ativo'),
('Fornecedor Beta', '98.765.432/0001-10', '(11) 9876-5432', 'vendas@beta.com', 'ativo'),
('Fornecedor Gamma', '11.222.333/0001-44', '(11) 1122-3344', 'comercial@gamma.com', 'ativo'),
('Fornecedor Delta', '55.666.777/0001-88', '(11) 5566-7788', 'suporte@delta.com', 'ativo');

-- Inserir usuário admin padrão
INSERT INTO usuarios (email, senha, role) VALUES
('admin@empresa.com', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZO', 'admin');

-- Inserir dados da empresa (exemplo)
INSERT INTO empresa (razao_social, nome_fantasia, cnpj, cidade, estado) VALUES
('Empresa Exemplo Ltda', 'Empresa Exemplo', '12.345.678/0001-99', 'São Paulo', 'SP');

-- Inserir alguns funcionários de exemplo
INSERT INTO funcionarios (nome, cargo, setor_id, turno_id, data_admissao, status) 
SELECT 
  'João Silva', 'Operador', s.id, t.id, '2023-01-15', 'ativo'
FROM setores s, turnos t 
WHERE s.nome = 'Produção' AND t.nome = 'Manhã'
LIMIT 1;

INSERT INTO funcionarios (nome, cargo, setor_id, turno_id, data_admissao, status) 
SELECT 
  'Maria Santos', 'Analista', s.id, t.id, '2023-02-01', 'ativo'
FROM setores s, turnos t 
WHERE s.nome = 'Qualidade' AND t.nome = 'Administrativo'
LIMIT 1;

-- Inserir alguns EPIs de exemplo
INSERT INTO epis (nome, ca, quantidade, quantidade_minima, local_estoque, fornecedor_id, status)
SELECT 
  'Capacete de Segurança', '12345', 50, 10, 'Almoxarifado A', f.id, 'ativo'
FROM fornecedores f 
WHERE f.nome = 'Fornecedor Alpha'
LIMIT 1;

INSERT INTO epis (nome, ca, quantidade, quantidade_minima, local_estoque, fornecedor_id, status)
SELECT 
  'Óculos de Proteção', '23456', 30, 5, 'Almoxarifado B', f.id, 'ativo'
FROM fornecedores f 
WHERE f.nome = 'Fornecedor Beta'
LIMIT 1;

INSERT INTO epis (nome, ca, quantidade, quantidade_minima, local_estoque, fornecedor_id, status)
SELECT 
  'Luvas de Segurança', '34567', 100, 20, 'Almoxarifado A', f.id, 'ativo'
FROM fornecedores f 
WHERE f.nome = 'Fornecedor Gamma'
LIMIT 1;
