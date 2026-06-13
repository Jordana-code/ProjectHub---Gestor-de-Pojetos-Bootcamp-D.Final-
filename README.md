# ProjectHub — Gestor de Projetos

**Organize, acompanhe e gerencie seus projetos em um único painel, com persistência em nuvem e suporte a tema claro/escuro.**


[![Deploy](https://img.shields.io/badge/Deploy-online-brightgreen?logo=vercel)](https://SEU-LINK-DE-DEPLOY.vercel.app)
[![Jest](https://img.shields.io/badge/Tested%20with-Jest-C21325?logo=jest)](https://jestjs.io)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/Licença-Acadêmica-blue)](#-licença)

> Entrega final — Etapa colaborativa.

</div>

---

## 📑 Sumário

- [Links](#-links)
- [Integrantes do Grupo](#-integrantes-do-grupo)
- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Arquitetura da Aplicação](#️-arquitetura-da-aplicação)
- [Banco de Dados — Supabase](#️-banco-de-dados--supabase)
- [Testes e CI/CD](#-testes-e-cicd)
- [Design System](#-design-system)
- [Fluxo de Trabalho da Equipe](#-fluxo-de-trabalho-da-equipe)
- [Licença](#-licença)

---

## 🔗 Links

| | Descrição | URL |
|---|---|---|
| <img src="https://cdn.simpleicons.org/github/white" width="18"/> | Repositório GitHub | [Acessar](https://github.com/Jordana-code/ProjectHub---Gestor-de-Pojetos-Bootcamp-D.Final-) |
| <img src="https://cdn.simpleicons.org/vercel/white" width="18"/> | Aplicação publicada (Deploy) | [Acessar](https://jordana-code.github.io/ProjectHub---Gestor-de-Pojetos-Bootcamp-D.Final-/) |
| <img src="https://cdn.simpleicons.org/supabase" width="18"/> | Projeto no Supabase | [Acessar](https://supabase.com/dashboard/project/alzhttmmmedypuknlexz) |
---

## 👥 Integrantes do Grupo

| Nome | GitHub |
|---|---|
| Jordana Moreira | [@Jordana-code](https://github.com/Jordana-code) |
| Caio Godoy | [@1caiogodoy](https://github.com/1caiogodoy) |
| Gabriella Lima | [@gabriellalmendes](https://github.com/gabriellalmendes) |

---

## 🧭 Visão Geral

O **ProjectHub** é uma aplicação web para criação, organização e acompanhamento de projetos por status de andamento, com painel de métricas em tempo real e persistência em nuvem via **Supabase (PostgreSQL)**. Os projetos são organizados em três etapas:

| Status | Descrição |
|---|---|
| 🧭 Em Planejamento | Projeto definido, ainda não iniciado |
| 📈 Em Andamento | Projeto em execução ativa |
| ✅ Concluído | Projeto finalizado e entregue |

---

## ✨ Funcionalidades

- **CRUD completo** — criar, listar, editar e excluir projetos via modal, com confirmação antes de remover;
- **Filtros por status** na sidebar com contadores ao vivo e estado vazio amigável;
- **Painel de métricas** com quatro cartões e barras de progresso proporcionais ao total;
- **Modo Claro / Escuro** com preferência salva via `localStorage`;
- **Notificações toast** (sucesso em verde, erro em vermelho) e indicador de carregamento;
- **Proteção XSS** via `escapeHtml()` em todos os dados exibidos;
- **RLS no Supabase** para controle de acesso aos dados.

---

## 🚀 Tecnologias Utilizadas

| Camada | Tecnologia |
|---|---|
| Estrutura | HTML5 |
| Estilo | CSS3 (variáveis customizadas, temas claro/escuro) |
| Lógica | JavaScript Vanilla ES6+ |
| Ícones | [Font Awesome 6](https://fontawesome.com/) |
| Fonte | [Inter](https://fonts.google.com/specimen/Inter) |
| Banco de Dados | [Supabase](https://supabase.com) (PostgreSQL na nuvem) |
| Testes | [Jest 29](https://jestjs.io/) |
| CI/CD | GitHub Actions |
| Hospedagem | GitHub Pages |

---

## 📁 Estrutura do Projeto

```
projecthub/
├── .github/workflows/ci.yml    # Pipeline de CI: roda testes a cada push/PR
├── __tests__/utils.test.js     # Testes unitários (Jest)
├── database/schema.sql         # Script SQL: tabela "projects" e políticas RLS
├── config.js                   # Conexão com o Supabase (URL + anon key)
├── utils.js                    # Funções puras e testáveis
├── script.js                   # Lógica principal (CRUD, renderização, UI)
├── index.html                  # Estrutura da página
├── style.css                   # Estilos e design tokens
├── management.png              # Ícone/favicon
├── package.json                # Dependências de desenvolvimento          
└── README.md                   # Este arquivo
```

---

## ⚙️ Arquitetura da Aplicação

```
┌─────────────────────────────────────────────────┐
│          index.html  +  style.css               │
│       (Estrutura visual / Design Tokens)         │
├───────────────────┬─────────────────────────────┤
│    script.js      │         utils.js             │
│  (CRUD, UI, DOM)  │  escapeHtml, computeMetrics  │
│                   │  filterProjects, mapFromDb   │
├───────────────────┴─────────────────────────────┤
│    config.js  (URL + anon key + supabaseClient) │
├─────────────────────────────────────────────────┤
│           Supabase — tabela: projects            │
└─────────────────────────────────────────────────┘
```

**`utils.js`** concentra funções puras reutilizadas pelo `script.js` e pelos testes: `escapeHtml`, `computeMetrics`, `filterProjects`, `mapFromDb` e `mapToDb`.

**`script.js`** orquestra a aplicação: busca dados (`fetchProjects`), executa o CRUD (`createProjectInDb`, `updateProjectInDb`, `deleteProjectInDb`), renderiza cartões e métricas, controla o modal e alterna o tema.

---

## 🗄️ Banco de Dados — Supabase

### Estrutura da tabela `projects`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `bigserial` | Chave primária (auto-incremento) |
| `title` | `text` | Nome do projeto |
| `description` | `text` | Descrição/objetivo |
| `status` | `text` | `Em Planejamento` \| `Em Andamento` \| `Concluído` |
| `created_at` | `timestamptz` | Data de criação (usada para ordenar) |




---

## ✅ Testes e CI/CD

As funções de `utils.js` são testadas com **Jest** — por serem puras, não dependem do DOM nem do banco.

```bash
npm test
```

| Função testada | O que verifica |
|---|---|
| `escapeHtml` | Escapa `<`, `>`, `&` e `"` corretamente |
| `computeMetrics` | Totais por status a partir da lista de projetos |
| `filterProjects` | Filtro `'todos'` e por status específico |
| `mapFromDb` / `mapToDb` | Conversão entre formato do Supabase e formato interno |

O workflow `.github/workflows/ci.yml` executa `npm test` automaticamente em todo **push** e **pull request** para a branch `main`. O badge de CI no topo reflete o status atual.

---

## 🎨 Design System

Tokens CSS definidos em `:root`, sobrescritos em `[data-theme="dark"]`:

| Token | Valor | Uso |
|---|---|---|
| `--accent` | `#6366F1` | Botões, links ativos, foco |
| `--planning-color` | `#64748B` | Status "Em Planejamento" |
| `--progress-color` | `#D97706` | Status "Em Andamento" |
| `--done-color` | `#059669` | Status "Concluído" |
| `--sidebar-bg` | `#0F1117` | Sidebar (sempre escura) |

- **Fonte**: Inter (pesos 400–800) · **Raios**: `8px` / `12px` / `16px` · **Transições**: `0.2s ease`
- **Layout**: sidebar fixa de `260px` + área principal com grade responsiva

---

## 🤝 Fluxo de Trabalho da Equipe

1. Issues abertas por funcionalidade;
2. Branches por feature (`feature/nome`);
3. Pull Requests com descrição e code review entre integrantes;
4. Merge liberado apenas com CI passando na `main`.

### Checklist de entrega

- [x] Todos os integrantes adicionados como *Collaborators*
- [X] Cada integrante abriu pelo menos 1 PR
- [X] Cada PR foi revisado e mergeado por outro integrante
- [X] CI passando na branch `main`
- [X] `config.js` configurado e tabela criada via `schema.sql`
- [X] Aplicação publicada com link funcionando
- [X] `README.md` atualizado com links e integrantes

---

## 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais. Sinta-se livre para utilizá-lo como referência, desde que mantida a devida atribuição aos autores originais.

---

<div align="center">
  <sub>Feito com 💜 por Jordana Moreira, Caio Godoy e Gabriella Lima &nbsp;·&nbsp; © 2026 ProjectHub</sub>
</div>
