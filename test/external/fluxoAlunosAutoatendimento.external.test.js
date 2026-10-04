import { api } from '../helpers/api.js'
import { expect } from 'chai';
import { adminToken, alunoToken } from '../helpers/auth.js'
import testesDeTrabalhos from '../fixtures/trabalhosAluno.json' with { type: 'json' };
import 'dotenv/config'

describe.only('Alunos Autoatendimento  - External', () => {

    let alunosCadastradosId = []
    let disciplinasCadastradasId = []

    testesDeTrabalhos.forEach((testeDeTrabalho, index) => {
        it.only(testeDeTrabalho.testTitle, async() => {
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
            
            const cadastroMatriculaResposta = await api()
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