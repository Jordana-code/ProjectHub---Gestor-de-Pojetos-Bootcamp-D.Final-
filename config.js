// ==========================================================================
// CONFIGURAÇÃO DO BANCO DE DADOS (SUPABASE)
// ==========================================================================
//
// 1. Crie uma conta/projeto gratuito em https://supabase.com
// 2. Vá em "Project Settings" > "API" e copie:
//      - "Project URL"      -> cole em SUPABASE_URL
//      - "anon public" key  -> cole em SUPABASE_ANON_KEY
// 3. Execute o script "database/schema.sql" no "SQL Editor" do Supabase
//    para criar a tabela "projects" e as permissões (RLS).
//
// A "anon key" é uma chave PÚBLICA, feita para ser usada em apps
// client-side como este. A segurança fica a cargo das políticas de
// Row Level Security (RLS) definidas em database/schema.sql.
// ==========================================================================

const SUPABASE_URL = 'https://alzhttmmmedypuknlexz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsemh0dG1tbWVkeXB1a25sZXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyOTkwODIsImV4cCI6MjA5Njg3NTA4Mn0.iPAMl61x7N9iVAXN7REIiGaZHIaxNQfAgmGIhZvb7ek';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const PROJECTS_TABLE = 'projects';