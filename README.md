# ProjectHub — Gestor de Projetos

Aplicação web para criar, acompanhar e gerenciar projetos por status
(*Em Planejamento*, *Em Andamento*, *Concluído*), com painel de métricas,
modo claro/escuro e persistência dos dados em um banco de dados na nuvem.

> Entrega final — Etapa colaborativa (trabalho em equipe, PRs, Banco de
> Dados em nuvem, CI/CD e Deploy).

---

## 👥 Integrantes do Grupo

> Preencher com o nome completo e a matrícula de cada integrante.

| Nome completo | Matrícula | GitHub |
|---|---|---|
| Jordana Moreira | (preencher) | [@Jordana-code](https://github.com/Jordana-code) |
| Caio Godoy | (preencher) | [@1caiogodoy](https://github.com/1caiogodoy) |
| Gabriella Lima | (preencher) | [@gabriellalmendes](https://github.com/gabriellalmendes) |
| (integrante 4, se houver) | (preencher) | (preencher) |
| (integrante 5, se houver) | (preencher) | (preencher) |

---

## 🔗 Links

- **Repositório:** `(preencher com a URL pública do repositório no GitHub)`
- **Aplicação publicada (Deploy):** `(preencher com a URL do Vercel/Render/Netlify)`

---

## 🚀 Tecnologias

- HTML5, CSS3, JavaScript (vanilla)
- [Font Awesome](https://fontawesome.com/) (ícones)
- **Banco de dados em nuvem:** [Supabase](https://supabase.com) (PostgreSQL)
- **Testes:** [Jest](https://jestjs.io/)
- **CI/CD:** GitHub Actions
- **Deploy:** Vercel (ou outro serviço de hospedagem estática)

---

## 🗄️ Banco de Dados

Os projetos não são mais salvos em `localStorage`. Toda a persistência
(criação, leitura, edição e exclusão) é feita em uma tabela `projects` em um
projeto Supabase (PostgreSQL na nuvem).

### Como configurar o seu próprio projeto Supabase

1. Crie uma conta gratuita em [supabase.com](https://supabase.com) e crie um
   novo projeto.
2. Abra o **SQL Editor** do projeto e execute o conteúdo do arquivo
   [`database/schema.sql`](./database/schema.sql). Isso cria a tabela
   `projects`, as políticas de acesso (RLS) e dois projetos de exemplo.
3. Vá em **Project Settings → API** e copie:
   - **Project URL**
   - **anon public key**
4. Abra o arquivo [`config.js`](./config.js) e substitua:

```js
   const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
   const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANON_PUBLICA_AQUI';
```

   pelos valores do seu projeto.

> ⚠️ A `anon key` do Supabase é pública por design — a segurança fica a
> cargo das políticas de Row Level Security (RLS), já configuradas no
> `schema.sql`. Para um projeto real com dados sensíveis, restrinja o
> acesso por usuário autenticado.

---

## 💻 Como rodar localmente

Como o projeto é um site estático (HTML/CSS/JS), basta servir os arquivos:

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_REPOSITORIO>

# Configure o config.js (ver seção "Banco de Dados" acima)

# Sirva os arquivos com qualquer servidor estático, por exemplo:
npx serve .
# ou, com a extensão "Live Server" do VS Code
```

Abra o endereço informado no terminal (ex: `http://localhost:3000`).

---

## ✅ Testes Automatizados

As funções utilitárias (validação, cálculo de métricas, filtros e
conversão de dados para o Supabase) ficam em `utils.js` e são testadas com
Jest em `__tests__/utils.test.js`.

```bash
npm install
npm test
```

O workflow [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) executa
`npm test` automaticamente em todo **push** e **pull request** para a branch
`main`, via GitHub Actions.

---

## 🌐 Deploy

A aplicação é estática e pode ser publicada em qualquer serviço de
hospedagem estática (Vercel, Netlify, GitHub Pages, Render, etc.).

Exemplo com a Vercel:

1. Importe o repositório em [vercel.com](https://vercel.com).
2. Não é necessário configurar build (projeto estático).
3. Após o deploy, atualize o link em "Links" acima.

> Lembre-se de configurar o `config.js` com as credenciais do Supabase
> *antes* do deploy (ou, em uma evolução futura, mover essas chaves para
> variáveis de ambiente injetadas no build).

---

## 🤝 Fluxo de Trabalho da Equipe (Issues, Branches e PRs)

Veja o arquivo [`CONTRIBUTING.md`](./CONTRIBUTING.md) para o passo a passo
completo que cada integrante deve seguir (criação de Issues, branches,
abertura de Pull Requests e Code Review).

---

## 📁 Estrutura do Projeto

```
.
├── .github/workflows/ci.yml   # Pipeline de CI (testes automáticos)
├── __tests__/utils.test.js    # Testes automatizados (Jest)
├── database/schema.sql        # Script de criação da tabela no Supabase
├── config.js                  # Configuração de conexão com o Supabase
├── utils.js                   # Funções utilitárias (puras e testáveis)
├── script.js                  # Lógica principal da aplicação (CRUD)
├── index.html                 # Estrutura da página
├── style.css                  # Estilos
├── management.png             # Ícone (favicon)
├── package.json
├── CONTRIBUTING.md             # Guia de colaboração (issues/branches/PRs)
└── README.md
```