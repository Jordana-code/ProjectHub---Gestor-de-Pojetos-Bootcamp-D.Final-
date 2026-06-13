// ==========================================================================
// SELEÇÃO DE ELEMENTOS
// ==========================================================================
const modalOverlay   = document.getElementById('modalOverlay');
const openModalBtn   = document.getElementById('openModalBtn');
const closeModalBtn  = document.getElementById('closeModalBtn');
const cancelBtn      = document.getElementById('cancelBtn');
const projectForm    = document.getElementById('projectForm');
const projectsGrid   = document.getElementById('projectsGrid');
const navItems       = document.querySelectorAll('.nav-item');
const modalTitle     = document.getElementById('modalTitle');
const projIdInput    = document.getElementById('projId');
const projTitleInput = document.getElementById('projTitle');
const projDescInput  = document.getElementById('projDesc');
const projStatusInput= document.getElementById('projStatus');
const saveBtn        = document.getElementById('saveBtn');
const toast          = document.getElementById('toast');
const toastMsg       = document.getElementById('toastMsg');

let currentFilter = 'todos';

// Lista de projetos em memória, sincronizada com o Supabase.
// (a função "save()" do localStorage foi substituída pelas
// funções create/update/delete em createProjectInDb, updateProjectInDb
// e deleteProjectInDb, que falam direto com o banco de dados na nuvem)
let projects = [];

// ==========================================================================
// TOAST
// ==========================================================================
let toastTimer;
function showToast(msg, isError = false) {
    toastMsg.textContent = msg;
    const icon = toast.querySelector('.toast-icon');
    icon.className = isError
        ? 'fa-solid fa-circle-xmark toast-icon'
        : 'fa-solid fa-circle-check toast-icon';
    icon.style.color = isError ? '#F87171' : '#6EE7B7';

    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==========================================================================
// CAMADA DE DADOS (SUPABASE)
// As funções abaixo são as únicas que conversam com o banco de dados.
// Elas usam o cliente "supabaseClient" configurado em config.js.
// ==========================================================================

/**
 * Busca todos os projetos no banco de dados, ordenados por data de criação.
 */
async function fetchProjects() {
    const { data, error } = await supabaseClient
        .from(PROJECTS_TABLE)
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Erro ao buscar projetos:', error);
        showToast('Não foi possível carregar os projetos do banco de dados.', true);
        return [];
    }

    return data.map(mapFromDb);
}

/**
 * Cria um novo projeto no banco de dados e retorna o registro criado
 * (já convertido para o formato interno da aplicação).
 */
async function createProjectInDb(project) {
    const { data, error } = await supabaseClient
        .from(PROJECTS_TABLE)
        .insert([mapToDb(project)])
        .select();

    if (error) {
        console.error('Erro ao criar projeto:', error);
        showToast('Não foi possível salvar o projeto no banco de dados.', true);
        return null;
    }

    return mapFromDb(data[0]);
}

/**
 * Atualiza um projeto existente no banco de dados e retorna o registro
 * atualizado.
 */
async function updateProjectInDb(id, project) {
    const { data, error } = await supabaseClient
        .from(PROJECTS_TABLE)
        .update(mapToDb(project))
        .eq('id', id)
        .select();

    if (error) {
        console.error('Erro ao atualizar projeto:', error);
        showToast('Não foi possível atualizar o projeto no banco de dados.', true);
        return null;
    }

    return mapFromDb(data[0]);
}

/**
 * Remove um projeto do banco de dados. Retorna true em caso de sucesso.
 */
async function deleteProjectInDb(id) {
    const { error } = await supabaseClient
        .from(PROJECTS_TABLE)
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erro ao excluir projeto:', error);
        showToast('Não foi possível excluir o projeto do banco de dados.', true);
        return false;
    }

    return true;
}

// ==========================================================================
// MÉTRICAS
// ==========================================================================
function updateMetrics() {
    const { total, plan, prog, done } = computeMetrics(projects);

    document.getElementById('count-todos').textContent        = total;
    document.getElementById('count-planejamento').textContent = plan;
    document.getElementById('count-andamento').textContent    = prog;
    document.getElementById('count-concluido').textContent    = done;

    document.getElementById('badge-todos').textContent        = total;
    document.getElementById('badge-planejamento').textContent = plan;
    document.getElementById('badge-andamento').textContent    = prog;
    document.getElementById('badge-concluido').textContent    = done;

    // mini progress bars — based on total
    const pct = (n) => total === 0 ? '0%' : (n / total * 100) + '%';
    document.getElementById('bar-total').style.width        = total > 0 ? '100%' : '0%';
    document.getElementById('bar-planejamento').style.width  = pct(plan);
    document.getElementById('bar-andamento').style.width     = pct(prog);
    document.getElementById('bar-concluido').style.width     = pct(done);
}

// ==========================================================================
// RENDERIZAÇÃO
// ==========================================================================
const statusClasses = {
    'Em Planejamento': 'planejamento',
    'Em Andamento':    'andamento',
    'Concluído':       'concluido'
};

const statusCardClasses = {
    'Em Planejamento': 'status-planejamento',
    'Em Andamento':    'status-andamento',
    'Concluído':       'status-concluido'
};

const filterLabels = {
    'todos':           'Todos os Projetos',
    'Em Planejamento': 'Em Planejamento',
    'Em Andamento':    'Em Andamento',
    'Concluído':       'Concluídos'
};

function renderProjects() {
    projectsGrid.innerHTML = '';

    const filtered = filterProjects(projects, currentFilter);

    // update section heading
    document.getElementById('sectionTitle').textContent = filterLabels[currentFilter] || 'Projetos';
    const countTag = document.getElementById('projectCountTag');
    countTag.textContent = `${filtered.length} ${filtered.length === 1 ? 'projeto' : 'projetos'}`;

    if (filtered.length === 0) {
        projectsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fa-regular fa-folder-open"></i></div>
                <h3>Nenhum projeto aqui</h3>
                <p>Crie um novo projeto clicando em "Novo Projeto" no topo da página.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(project => {
        const card = document.createElement('div');
        card.className = `project-card ${statusCardClasses[project.status] || ''}`;
        card.innerHTML = `
            <div class="card-top">
                <h3 class="card-title">${escapeHtml(project.title)}</h3>
                <div class="card-actions">
                    <button class="btn-action edit" onclick="editProject(${project.id})" title="Editar projeto">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button class="btn-action delete" onclick="deleteProject(${project.id})" title="Excluir projeto">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </div>
            <p class="card-desc">${escapeHtml(project.desc)}</p>
            <span class="status-badge ${statusClasses[project.status] || ''}">${project.status}</span>
        `;
        projectsGrid.appendChild(card);
    });
}

function renderLoadingState() {
    projectsGrid.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon"><i class="fa-solid fa-spinner fa-spin"></i></div>
            <h3>Carregando projetos...</h3>
            <p>Conectando ao banco de dados.</p>
        </div>
    `;
}

// ==========================================================================
// MODAL
// ==========================================================================
function openModal(isEdit = false) {
    modalTitle.textContent = isEdit ? 'Editar Projeto' : 'Criar Novo Projeto';
    saveBtn.innerHTML = isEdit
        ? '<i class="fa-solid fa-floppy-disk"></i> Salvar Alterações'
        : '<i class="fa-solid fa-floppy-disk"></i> Salvar Projeto';
    modalOverlay.classList.add('active');
    setTimeout(() => projTitleInput.focus(), 150);
}

function closeModal() {
    modalOverlay.classList.remove('active');
    projectForm.reset();
    projIdInput.value = '';
}

// ==========================================================================
// CRUD
// ==========================================================================
async function handleFormSubmit(e) {
    e.preventDefault();

    const id     = projIdInput.value;
    const title  = projTitleInput.value.trim();
    const desc   = projDescInput.value.trim();
    const status = projStatusInput.value;

    if (!title || !desc) return;

    const originalBtnContent = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';

    try {
        if (id) {
            const updated = await updateProjectInDb(id, { title, desc, status });
            if (updated) {
                projects = projects.map(p => p.id == id ? updated : p);
                showToast('Projeto atualizado com sucesso!');
                updateMetrics();
                renderProjects();
                closeModal();
            }
        } else {
            const created = await createProjectInDb({ title, desc, status });
            if (created) {
                projects.push(created);
                showToast('Projeto criado com sucesso!');
                updateMetrics();
                renderProjects();
                closeModal();
            }
        }
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalBtnContent;
    }
}

window.editProject = function(id) {
    const p = projects.find(p => p.id === id);
    if (!p) return;

    projIdInput.value     = p.id;
    projTitleInput.value  = p.title;
    projDescInput.value   = p.desc;
    projStatusInput.value = p.status;

    openModal(true);
};

window.deleteProject = async function(id) {
    if (!confirm('Tem certeza que deseja remover permanentemente este projeto?')) return;

    const ok = await deleteProjectInDb(id);
    if (ok) {
        projects = projects.filter(p => p.id !== id);
        updateMetrics();
        renderProjects();
        showToast('Projeto removido.');
    }
};

// ==========================================================================
// EVENT LISTENERS
// ==========================================================================
openModalBtn.addEventListener('click', () => openModal(false));
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
projectForm.addEventListener('submit', handleFormSubmit);

modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
});

navItems.forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        currentFilter = item.getAttribute('data-filter');
        renderProjects();
    });
});

// ==========================================================================
// DARK MODE
// (preferência de interface — continua salva localmente, pois não faz
// parte dos dados da aplicação exigidos no banco de dados)
// ==========================================================================
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon      = themeToggleBtn.querySelector('i');
const themeLabel     = document.getElementById('themeLabel');

const savedTheme = localStorage.getItem('harmony_theme') || 'light';
applyTheme(savedTheme);

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
        themeIcon.className = 'fa-solid fa-sun';
        themeLabel.textContent = 'Modo Claro';
    } else {
        themeIcon.className = 'fa-solid fa-moon';
        themeLabel.textContent = 'Modo Escuro';
    }
}

themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('harmony_theme', next);
});

// ==========================================================================
// INICIALIZAÇÃO
// ==========================================================================
async function init() {
    renderLoadingState();
    projects = await fetchProjects();
    updateMetrics();
    renderProjects();
}

init();