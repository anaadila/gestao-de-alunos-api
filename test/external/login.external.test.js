import { api } from '../helpers/api.js'
import { expect } from 'chai';
import testesDeLoginAdmin from '../fixtures/loginAdminNegativos.json' with { type: 'json' };
import 'dotenv/config'



describe.only('Login - External', () => {

    it('ADMIN - Deve retornar 200 quando o usuário e senha forem corretos', async () => {
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 'email': process.env.ADMIN_EMAIL, 'senha': process.env.ADMIN_PASSWORD });
        
        expect(loginResposta.status).to.equal(200);
        expect(loginResposta.body.usuario.role).to.equal('admin')
    });

    testesDeLoginAdmin.forEach(testeDeLogin => {
        it(testeDeLogin.testTitle, async () => {
            const loginResposta = await api()
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send(testeDeLogin.dadosLogin);
            
            expect(loginResposta.status).to.equal(testeDeLogin.statusCodeEsperado);
            expect(loginResposta.body.error).to.equal(testeDeLogin.mensagemDeErroEsperada)
        });
    });
});