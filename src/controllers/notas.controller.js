import asyncHandler from '../utils/asyncHandler.js';
import * as notasService from '../services/notas.service.js';

export const listar = asyncHandler(async (req, res) => {
  const { alunoId, disciplinaId } = req.query;
  res.json(notasService.listar({ alunoId, disciplinaId }));
});

export const buscarPorId = asyncHandler(async (req, res) => {
  res.json(notasService.buscarPorId(req.params.id));
});

export const criar = asyncHandler(async (req, res) => {
  const nota = notasService.criar(req.body);
  res.status(201).json(nota);
});

export const atualizar = asyncHandler(async (req, res) => {
  res.json(notasService.atualizar(req.params.id, req.body));
});

export const remover = asyncHandler(async (req, res) => {
  notasService.remover(req.params.id);
  res.status(204).send();
});
