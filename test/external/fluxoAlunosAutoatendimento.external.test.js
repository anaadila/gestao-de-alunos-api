import { api } from '../helpers/api.js'
import { expect } from 'chai';
import { adminToken, alunoToken } from '../helpers/auth.js'
import testesDeTrabalhos from '../fixtures/trabalhosAluno.json' with { type: 'json' };

describe('Alunos Autoatendimento  - External', () => {

    let alunosCadastradosId = []
    let disciplinasCadastradasId = []

    testesDeTrabalhos.filter(casos => casos.tipo === 'positivo').forEach((testeDeTrabalho, index) => {
        it(testeDeTrabalho.testTitle, async() => {
            const cadastroAlunoReposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await adminToken())
            .send(testeDeTrabalho.dadosAluno);

            alunosCadastradosId.push(cadastroAlunoReposta.body.id);

            const cadastroDisciplinaResposta = await api()
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', await adminToken())
            .send(testeDeTrabalho.dadosDisciplina);

            disciplinasCadastradasId.push(cadastroDisciplinaResposta.body.id);
            
            await api()
            .post(`/api/admin/disciplinas/${disciplinasCadastradasId[index]}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await adminToken())
            .send({
                alunoId: alunosCadastradosId[index]
            });

            const cadastroTrabalhoResposta = await api()
            .post(`/api/alunos/${alunosCadastradosId[index]}/trabalhos`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await alunoToken(testeDeTrabalho.dadosAluno.email, testeDeTrabalho.dadosAluno.senha))
            .send({
                disciplinaId: disciplinasCadastradasId[index],
                titulo: testeDeTrabalho.dadosTrabalho.titulo,
                descricao: testeDeTrabalho.dadosTrabalho.descricao
            });

            expect(cadastroTrabalhoResposta.status).to.equal(testeDeTrabalho.statusCodeEsperado);
            expect(cadastroTrabalhoResposta.body.status).to.equal(testeDeTrabalho.statusEsperado);
        })
    });

    testesDeTrabalhos.filter(casos => casos.tipo === 'negativo').forEach((testeDeTrabalho, index) => {
        it(testeDeTrabalho.testTitle, async () => {
            const cadastroTrabalhoResposta = await api()
            .post(`/api/alunos/${testeDeTrabalho.alunoId}/trabalhos`)
            .set('Content-Type', 'application/json')
            .set('Authorization', testeDeTrabalho.token || await alunoToken())
            .send(testeDeTrabalho.dadosTrabalho);

            expect(cadastroTrabalhoResposta.status).to.equal(testeDeTrabalho.statusCodeEsperado);
            expect(cadastroTrabalhoResposta.body.error).to.equal(testeDeTrabalho.mensagemDeErroEsperada);
        });
    });

    it('Deve retornar 403 ao registrar um trabalho em uma disciplina em que um aluno está matriculado com token de outro aluno', async () => {
        const cadastroAlunoReposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await adminToken())
            .send({
                nome: 'João Gabriel',
                email: 'joao-gabriel@example.com',
                matricula: 'JG123456',
                senha: '123456'
            });
        
        alunosCadastradosId.push(cadastroAlunoReposta.body.id);

        const cadastroTrabalhoResposta = await api()
            .post(`/api/alunos/aluno-ana-souza/trabalhos`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await alunoToken('joao-gabriel@example.com','123456'))
            .send({
                disciplinaId: 'disciplina-matematica',
                titulo: 'Trabalho final de Automação de Testes',
                descricao: 'Repositório do trabalho final de Automação de Testes do curso de Pós-Graduação em Testes de Software.'
            });

        expect(cadastroTrabalhoResposta.status).to.equal(403);
        expect(cadastroTrabalhoResposta.body.error).to.equal('Você só pode acessar os seus próprios dados.');
    });

    after(() => {
        alunosCadastradosId.forEach(async alunoCadastradoId => {
            await api()
                .delete(`/api/admin/alunos/${alunoCadastradoId}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', await adminToken())
        })

        disciplinasCadastradasId.forEach(async disciplinaCadastradaId => {
            await api()
                .delete(`/api/admin/disciplinas/${disciplinaCadastradaId}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', await adminToken())
        })
    })
});