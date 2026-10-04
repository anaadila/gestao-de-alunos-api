import { api } from '../helpers/api.js'
import 'dotenv/config'

let cacheTokenAdmin = null
let cacheTokenAluno = null

export async function adminToken() {
    if (!cacheTokenAdmin) {
    const loginResposta = await api()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 
            email: process.env.ADMIN_EMAIL, 
            senha: process.env.ADMIN_PASSWORD 
        });
    
    cacheTokenAdmin = loginResposta.body.token;
    }

    return `Bearer ${cacheTokenAdmin}`
}

export async function alunoToken() {
    if (!cacheTokenAluno) {
    const loginResposta = await api()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 
            email: process.env.ALUNO_EMAIL, 
            senha: process.env.ALUNO_PASSWORD 
        });
    
    cacheTokenAluno = loginResposta.body.token;
    }

    return `Bearer ${cacheTokenAluno}`
}