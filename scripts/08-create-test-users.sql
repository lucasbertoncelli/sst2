-- Este script deve ser executado no painel do Supabase ou via API
-- Os usuários devem ser criados através do Supabase Auth, não diretamente no banco

-- IMPORTANTE: Execute estes comandos no painel do Supabase > Authentication > Users
-- Ou use a API do Supabase para criar os usuários

-- Exemplo de como criar usuários via SQL (apenas para referência)
-- Na prática, use o painel do Supabase ou a API

/*
Para criar usuários de teste, use o painel do Supabase:

1. Vá para Authentication > Users
2. Clique em "Add user"
3. Crie os seguintes usuários:

Email: admin@empresa.com
Password: admin123
Metadata: {"full_name": "Administrador", "role": "admin"}

Email: rh@empresa.com  
Password: rh123
Metadata: {"full_name": "RH Manager", "role": "rh"}

Email: sst@empresa.com
Password: sst123
Metadata: {"full_name": "SST Manager", "role": "sst"}

Email: viewer@empresa.com
Password: viewer123
Metadata: {"full_name": "Visualizador", "role": "viewer"}

OU use este código JavaScript no console do navegador no painel do Supabase:
*/

-- Função para criar usuários via API (execute no console do navegador)
