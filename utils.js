// ==========================================================================
// FUNÇÕES UTILITÁRIAS
// Funções puras, sem dependência do DOM, para que possam ser testadas
// automaticamente (ver utils.test.js) e reaproveitadas pelo script.js.
// ==========================================================================

/**
 * Escapa caracteres especiais de HTML para evitar injeção (XSS)
 * ao exibir dados vindos do usuário/banco de dados.
 */
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * Calcula as métricas (totais por status) a partir da lista de projetos.
 */
function computeMetrics(projects) {
    const total = projects.length;
    const plan  = projects.filter(p => p.status === 'Em Planejamento').length;
    const prog  = projects.filter(p => p.status === 'Em Andamento').length;
    const done  = projects.filter(p => p.status === 'Concluído').length;
    return { total, plan, prog, done };
}

/**
 * Filtra a lista de projetos pelo status selecionado na sidebar.
 * 'todos' retorna a lista completa.
 */
function filterProjects(projects, filter) {
    if (filter === 'todos') return projects;
    return projects.filter(p => p.status === filter);
}

/**
 * Converte um registro vindo do Supabase (snake_case / coluna "description")
 * para o formato usado internamente pela aplicação (camelCase / campo "desc").
 */
function mapFromDb(record) {
    return {
        id: record.id,
        title: record.title,
        desc: record.description,
        status: record.status
    };
}

/**
 * Converte um projeto do formato interno da aplicação para o formato
 * de colunas esperado pela tabela "projects" no Supabase.
 */
function mapToDb(project) {
    return {
        title: project.title,
        description: project.desc,
        status: project.status
    };
}

// Exporta as funções para uso no Node.js (testes com Jest).
// No navegador, este bloco é ignorado e as funções ficam disponíveis
// globalmente para o script.js.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { escapeHtml, computeMetrics, filterProjects, mapFromDb, mapToDb };
}