import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { adminToken } from '../helpers/auth.js';
import testesDeMatriculas from '../fixtures/matriculas.json' with { type: 'json' };

describe('Matrícula de Aluno em Disciplina', async () => {
    testesDeMatriculas.forEach(testeDeMatricula => {
        it(testeDeMatricula.testTitle, async() => {
            const cadastroAlunoReposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await adminToken())
            .send(testeDeMatricula.dadosAluno);

            const alunoId = cadastroAlunoReposta.body.id;

            const cadastroDisciplinaResposta = await api()
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', await adminToken())
            .send(testeDeMatricula.dadosDisciplina);

            const disciplinaId = cadastroDisciplinaResposta.body.id;
            
            const cadastroMatriculaResposta = await api()
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await adminToken())
            .send({
                alunoId: alunoId
            });

            expect(cadastroMatriculaResposta.status).to.equal(testeDeMatricula.statusCodeEsperado);
            expect(cadastroMatriculaResposta.body.alunoId).to.equal(alunoId);
            expect(cadastroMatriculaResposta.body.disciplinaId).to.equal(disciplinaId);
        })
    });

});