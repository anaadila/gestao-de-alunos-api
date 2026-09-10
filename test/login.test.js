import request from 'supertest';
import app from '../src/app.js';
import { expect } from 'chai';

describe('Login', () => {

    it('deve retornar 200 quando o usuário e senha forem corretos', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 'email': 'admin@escola.com', 'senha': 'admin123' });
        
        expect(loginResposta.status).to.equal(200);
    });

    it('deve retornar 400 quando o usuário não enviar email', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 'email': '', 'senha': 'admin123' });
        
        expect(loginResposta.status).to.equal(400);
    });

    it('deve retornar 400 quando o usuário não enviar senha', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 'email': 'admin@escola.com', 'senha': '' });
        
        expect(loginResposta.status).to.equal(400);
    });

    it('deve retornar 401 quando o usuário inserir uma senha incorreta', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 'email': 'admin@escola.com', 'senha': 'admin1234' });
        
        expect(loginResposta.status).to.equal(401);
    });

    it('deve retornar 401 quando o usuário for inexistente', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 'email': 'inexistente@inexistente.com', 'senha': 'admin123' });
        
        expect(loginResposta.status).to.equal(401);
    });

});