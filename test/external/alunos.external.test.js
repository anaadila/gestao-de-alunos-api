import { api } from '../helpers/api.js'
import { expect } from 'chai';
import { adminToken } from '../helpers/auth.js'
import { novoAluno } from '../factories/alunosFactory.js'
import 'dotenv/config'


describe('Alunos - External', () => {

    it('deve trazer todos os alunos cadastrados', async () => {

        const alunosResposta = await api()
            .get('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await adminToken())

        expect(alunosResposta.status).to.equal(200);
        expect(alunosResposta.body[0].id).to.equal('aluno-ana-souza');
        expect(alunosResposta.body[1].id).to.equal('aluno-bruno-lima');
        expect(alunosResposta.body[2].id).to.equal('aluno-carla-mendes');
        
    });

    it('deve cadastrar um aluno quando ele informa dados válidos', async () => {

        const novoAlunoResposta = novoAluno()

        const cadastroAlunoReposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await adminToken())
            .send(novoAlunoResposta);

        expect(cadastroAlunoReposta.status).to.equal(201);
        expect(cadastroAlunoReposta.body.nome).to.equal(novoAlunoResposta.nome);
        expect(cadastroAlunoReposta.body.email).to.equal(novoAlunoResposta.email);
        expect(cadastroAlunoReposta.body.matricula).to.equal(novoAlunoResposta.matricula);
    });

    it('deve negar o cadastro de um aluno quando ele já existe', async () => {
        const cadastroAlunoReposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await adminToken())
            .send({
                nome: 'Ana Souza',
                email: 'ana.souza@example.com',
                matricula: '2024001',
                senha: '123456'
            });

        expect(cadastroAlunoReposta.status).to.equal(409);
        expect(cadastroAlunoReposta.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.');
    });

    
});