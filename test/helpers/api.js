import request from 'supertest';
import 'dotenv/config'

const BASE_URL = process.env.BASE_URL || 'hhttp://localhost:3000';

export function api() {
    return request(BASE_URL);
}