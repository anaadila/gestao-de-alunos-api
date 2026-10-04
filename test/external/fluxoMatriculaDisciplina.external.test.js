import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { adminToken } from '../helpers/auth.js';
import testesDeMatriculas from '../fixtures/matriculas.json' with { type: 'json' };

describe('Matrícula de Aluno em Disciplina - External', () => {

    let alunosCadastradosId = []
    let disciplinasCadastradasId = []

    testesDeMatriculas.forEach(testeDeMatricula => {
        it(testeDeMatricula.testTitle, async() => {
            const cadastroAlunoReposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await adminToken())
            .send(testeDeMatricula.dadosAluno);

            alunosCadastradosId.push(cadastroAlunoReposta.body.id);

            const alunoId = cadastroAlunoReposta.body.id;

            const cadastroDisciplinaResposta = await api()
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', await adminToken())
            .send(testeDeMatricula.dadosDisciplina);

            disciplinasCadastradasId.push(cadastroDisciplinaResposta.body.id);

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

    after(async () => {
        for (const alunoCadastradoId of alunosCadastradosId) {
            await api()
                .delete(`/api/admin/alunos/${alunoCadastradoId}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', await adminToken())
        }

        for (const disciplinaCadastradaId of disciplinasCadastradasId) {
            await api()
                .delete(`/api/admin/disciplinas/${disciplinaCadastradaId}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', await adminToken())
        }
    })

});