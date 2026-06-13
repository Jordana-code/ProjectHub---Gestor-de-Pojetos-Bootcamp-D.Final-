-- 1) Cria a tabela, caso ainda não exista
create table if not exists public.projects (
    id          bigint generated always as identity primary key,
    title       text not null,
    description text not null default '',
    status      text not null default 'Em Planejamento',
    created_at  timestamp with time zone not null default now()
);

-- 2) Habilita o Row Level Security (RLS) na tabela
alter table public.projects enable row level security;

-- 3) Remove políticas antigas com o mesmo nome (evita erro ao rodar de novo)
drop policy if exists "Permitir leitura publica"   on public.projects;
drop policy if exists "Permitir insercao publica"  on public.projects;
drop policy if exists "Permitir atualizacao publica" on public.projects;
drop policy if exists "Permitir exclusao publica"  on public.projects;

-- 4) Cria as políticas que liberam SELECT, INSERT, UPDATE e DELETE
--    para a chave "anon" (usada pelo app no navegador via config.js)
create policy "Permitir leitura publica"
    on public.projects
    for select
    to anon
    using (true);

create policy "Permitir insercao publica"
    on public.projects
    for insert
    to anon
    with check (true);

create policy "Permitir atualizacao publica"
    on public.projects
    for update
    to anon
    using (true)
    with check (true);

create policy "Permitir exclusao publica"
    on public.projects
    for delete
    to anon
    using (true);

-- 5) (Opcional) Insere dois projetos de exemplo para já ver algo na tela
insert into public.projects (title, description, status)
values
    ('Redesign do E-commerce', 'Reformular o layout e a experiência de compra do site.', 'Em Andamento'),
    ('App de Tarefas', 'Aplicativo para organização de tarefas pessoais.', 'Em Planejamento')
on conflict do nothing;