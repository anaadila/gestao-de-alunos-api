import bcrypt from 'bcryptjs';
import db from '../database/db.js';
import { createAluno } from '../models/aluno.model.js';
import ApiError from '../utils/ApiError.js';

export function listar() {
  return db.all('alunos');
}

export function buscarPorId(id) {
  const aluno = db.findById('alunos', id);
  if (!aluno) throw new ApiError(404, `Aluno com id "${id}" não encontrado.`);
  return aluno;
}

export function criar(dados) {
  const { nome, email, matricula, senha } = dados;
  if (!nome || !email || !matricula || !senha) {
    throw new ApiError(400, 'Os campos "nome", "email", "matricula" e "senha" são obrigatórios.');
  }

  const jaExiste = db.all('alunos').some((a) => a.matricula === matricula || a.email === email);
  if (jaExiste) {
    throw new ApiError(409, 'Já existe um aluno cadastrado com essa matrícula ou e-mail.');
  }

  const aluno = createAluno({ nome, email, matricula, senha });
  db.insert('alunos', aluno);
  return aluno;
}

export function atualizar(id, dados) {
  buscarPorId(id);
  const { nome, email, matricula, senha } = dados;
  return db.update('alunos', id, {
    ...(nome !== undefined && { nome }),
    ...(email !== undefined && { email }),
    ...(matricula !== undefined && { matricula }),
    ...(senha !== undefined && { senha: bcrypt.hashSync(senha, 10) }),
  });
}

export function remover(id) {
  buscarPorId(id);
  db.remove('alunos', id);
}

export function listarDisciplinas(alunoId) {
  buscarPorId(alunoId);
  const disciplinas = db.all('disciplinas');
  return db
    .all('matriculas')
    .filter((m) => m.alunoId === alunoId)
    .map((m) => disciplinas.find((d) => d.id === m.disciplinaId))
    .filter(Boolean);
}

export function listarNotas(alunoId, disciplinaId) {
  buscarPorId(alunoId);
  return db
    .all('notas')
    .filter((n) => n.alunoId === alunoId && (!disciplinaId || n.disciplinaId === disciplinaId));
}

export default { listar, buscarPorId, criar, atualizar, remover, listarDisciplinas, listarNotas };
