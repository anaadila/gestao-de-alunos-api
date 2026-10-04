import { api } from '../helpers/api.js'
import 'dotenv/config'

let cacheToken = null

export async function adminToken() {
    if (!cacheToken) {
    const loginResposta = await api()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 
            email: process.env.ADMIN_EMAIL, 
            senha: process.env.ADMIN_PASSWORD 
        });
    
    cacheToken = loginResposta.body.token;
    }

    return `Bearer ${cacheToken}`
}