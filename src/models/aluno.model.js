import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';

export function createAluno({ nome, email, matricula, senha }) {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    nome,
    email,
    matricula,
    senha: bcrypt.hashSync(senha, 10),
    role: 'aluno',
    createdAt: now,
    updatedAt: now,
  };
}

export function sanitizeAluno(aluno) {
  if (!aluno) return aluno;
  const { senha, ...resto } = aluno;
  return resto;
}
