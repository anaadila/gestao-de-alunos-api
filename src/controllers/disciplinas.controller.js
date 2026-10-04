import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import * as disciplinasService from '../services/disciplinas.service.js';
import { sanitizeAluno } from '../models/aluno.model.js';

export const listar = asyncHandler(async (req, res) => {
  res.json(disciplinasService.listar());
});

export const buscarPorId = asyncHandler(async (req, res) => {
  res.json(disciplinasService.buscarPorId(req.params.id));
});

export const criar = asyncHandler(async (req, res) => {
  const disciplina = disciplinasService.criar(req.body);
  res.status(201).json(disciplina);
});

export const atualizar = asyncHandler(async (req, res) => {
  res.json(disciplinasService.atualizar(req.params.id, req.body));
});

export const remover = asyncHandler(async (req, res) => {
  disciplinasService.remover(req.params.id);
  res.status(204).send();
});

export const matricular = asyncHandler(async (req, res) => {
  const { alunoId } = req.body;
  if (!alunoId) {
    throw new ApiError(400, 'O campo "alunoId" é obrigatório.');
  }
  const matricula = disciplinasService.matricular(req.params.id, alunoId);
  res.status(201).json(matricula);
});

export const listarAlunos = asyncHandler(async (req, res) => {
  res.json(disciplinasService.listarAlunos(req.params.id).map(sanitizeAluno));
});
