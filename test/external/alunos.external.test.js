import { api } from '../helpers/api.js'
import { expect } from 'chai';
import { adminToken, alunoToken } from '../helpers/auth.js'
import testesDeAlunos from '../fixtures/alunos.json' with { type: 'json' };
import 'dotenv/config'


describe('Alunos - External', () => {

    let alunosCadastradosId = []

    it('Deve trazer todos os alunos cadastrados', async () => {

        const alunosResposta = await api()
            .get('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await adminToken())

        expect(alunosResposta.status).to.equal(200);
        expect(alunosResposta.body).to.be.an('array')

        if (alunosResposta.body.length > 0) {
            alunosResposta.body.forEach(aluno => {
                expect(aluno).to.have.property('id').that.is.a('string');
                expect(aluno).to.have.property('nome').that.is.a('string');
                expect(aluno).to.have.property('email').that.is.a('string');
                expect(aluno).to.have.property('matricula').that.is.a('string');
                expect(aluno).to.have.property('role').to.equal('aluno');
                expect(aluno).to.have.property('createdAt').that.is.a('string');
                expect(aluno).to.have.property('updatedAt').that.is.a('string');

                expect(aluno.id).to.not.be.empty;
                expect(aluno.matricula).to.not.be.empty;
            });
        }

    });

    testesDeAlunos.filter(casos => casos.tipo === 'positivo').forEach(testeDeAluno => {
        it(testeDeAluno.testTitle, async () => {

            const cadastroAlunoReposta = await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', await adminToken())
                .send(testeDeAluno.dadosAluno);

            expect(cadastroAlunoReposta.status).to.equal(testeDeAluno.statusCodeEsperado);
            expect(cadastroAlunoReposta.body.nome).to.equal(testeDeAluno.dadosAluno.nome);
            expect(cadastroAlunoReposta.body.email).to.equal(testeDeAluno.dadosAluno.email);
            expect(cadastroAlunoReposta.body.matricula).to.equal(testeDeAluno.dadosAluno.matricula);
            
            alunosCadastradosId.push(cadastroAlunoReposta.body.id)

        });
    });

    it('Deve retornar 409 quando o cadastro de um aluno já existe', async () => {
        const cadastroAlunoReposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await adminToken())
            .send({
                nome: 'Ana Souza',
                email: process.env.ALUNO_EMAIL,
                matricula: '12345678910',
                senha: process.env.ALUNO_PASSWORD
            });

        expect(cadastroAlunoReposta.status).to.equal(409);
        expect(cadastroAlunoReposta.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.');
    });

    it('Deve retornar 403 quando utilizar token de aluno para realizar o cadastro de um novo aluno', async () => {
        const cadastroAlunoReposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await alunoToken())
            .send({
                nome: 'Novo Aluno',
                email: 'novo.aluno@email',
                matricula: '123456',
                senha: '123456'
            });

        expect(cadastroAlunoReposta.status).to.equal(403);
        expect(cadastroAlunoReposta.body.error).to.equal('Você não tem permissão para acessar este recurso.');
    });

    testesDeAlunos.filter(casos => casos.tipo === 'negativo-401').forEach(testeDeAluno => {
        it(testeDeAluno.testTitle, async () => {
            const cadastroAlunoReposta = await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${testeDeAluno.token}`)
                .send(testeDeAluno.dadosAluno);

            expect(cadastroAlunoReposta.status).to.equal(testeDeAluno.statusCodeEsperado);
            expect(cadastroAlunoReposta.body.error).to.equal(testeDeAluno.mensagemdeErroEsperada);
        });
    });

    testesDeAlunos.filter(casos => casos.tipo === 'negativo-400').forEach(testeDeAluno => {
        it(testeDeAluno.testTitle, async () => {

            const cadastroAlunoReposta = await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', await adminToken())
                .send(testeDeAluno.dadosAluno);

            expect(cadastroAlunoReposta.status).to.equal(testeDeAluno.statusCodeEsperado);
            expect(cadastroAlunoReposta.body.error).to.equal(testeDeAluno.mensagemdeErroEsperada);

        });
    });

    after(() => {
        alunosCadastradosId.forEach(async alunoCadastradoId => {
            await api()
                .delete(`/api/admin/alunos/${alunoCadastradoId}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', await adminToken())
        })
    })


});