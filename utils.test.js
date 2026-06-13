const { escapeHtml, computeMetrics, filterProjects, mapFromDb, mapToDb } = require('../utils');

describe('escapeHtml', () => {
    test('escapa caracteres especiais de HTML', () => {
        expect(escapeHtml('<script>alert("oi")</script>'))
            .toBe('&lt;script&gt;alert(&quot;oi&quot;)&lt;/script&gt;');
    });

    test('escapa o caractere &', () => {
        expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    test('mantém strings sem caracteres especiais inalteradas', () => {
        expect(escapeHtml('Projeto comum')).toBe('Projeto comum');
    });
});

describe('computeMetrics', () => {
    const sample = [
        { id: 1, title: 'A', desc: 'a', status: 'Em Planejamento' },
        { id: 2, title: 'B', desc: 'b', status: 'Em Andamento' },
        { id: 3, title: 'C', desc: 'c', status: 'Em Andamento' },
        { id: 4, title: 'D', desc: 'd', status: 'Concluído' }
    ];

    test('calcula o total e os totais por status corretamente', () => {
        expect(computeMetrics(sample)).toEqual({
            total: 4,
            plan: 1,
            prog: 2,
            done: 1
        });
    });

    test('retorna zeros para uma lista vazia', () => {
        expect(computeMetrics([])).toEqual({
            total: 0,
            plan: 0,
            prog: 0,
            done: 0
        });
    });
});

describe('filterProjects', () => {
    const sample = [
        { id: 1, title: 'A', desc: 'a', status: 'Em Planejamento' },
        { id: 2, title: 'B', desc: 'b', status: 'Em Andamento' },
        { id: 3, title: 'C', desc: 'c', status: 'Concluído' }
    ];

    test('"todos" retorna a lista completa', () => {
        expect(filterProjects(sample, 'todos')).toHaveLength(3);
    });

    test('filtra apenas os projetos com o status informado', () => {
        const result = filterProjects(sample, 'Em Andamento');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(2);
    });

    test('retorna lista vazia quando nenhum projeto possui o status', () => {
        const result = filterProjects([], 'Concluído');
        expect(result).toHaveLength(0);
    });
});

describe('mapFromDb / mapToDb', () => {
    test('mapFromDb converte um registro do Supabase para o formato interno', () => {
        const record = { id: 10, title: 'Projeto X', description: 'Descrição X', status: 'Em Andamento' };
        expect(mapFromDb(record)).toEqual({
            id: 10,
            title: 'Projeto X',
            desc: 'Descrição X',
            status: 'Em Andamento'
        });
    });

    test('mapToDb converte o formato interno para o formato do Supabase', () => {
        const project = { title: 'Projeto X', desc: 'Descrição X', status: 'Em Andamento' };
        expect(mapToDb(project)).toEqual({
            title: 'Projeto X',
            description: 'Descrição X',
            status: 'Em Andamento'
        });
    });

    test('mapFromDb e mapToDb são inversas entre si', () => {
        const record = { id: 5, title: 'Y', description: 'Desc Y', status: 'Concluído' };
        const project = mapFromDb(record);
        const { id, ...projectWithoutId } = project;
        expect(mapToDb(projectWithoutId)).toEqual({
            title: record.title,
            description: record.description,
            status: record.status
        });
    });
});