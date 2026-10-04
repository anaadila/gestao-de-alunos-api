import asyncHandler from '../utils/asyncHandler.js';
import * as trabalhosService from '../services/trabalhos.service.js';

export const listar = asyncHandler(async (req, res) => {
  const { alunoId, disciplinaId, status } = req.query;
  res.json(trabalhosService.listar({ alunoId, disciplinaId, status }));
});

export const buscarPorId = asyncHandler(async (req, res) => {
  res.json(trabalhosService.buscarPorId(req.params.id));
});

export const corrigir = asyncHandler(async (req, res) => {
  res.json(trabalhosService.corrigir(req.params.id, req.body));
});

export const remover = asyncHandler(async (req, res) => {
  trabalhosService.remover(req.params.id);
  res.status(204).send();
});

export const registrar = asyncHandler(async (req, res) => {
  const trabalho = trabalhosService.registrar(req.params.alunoId, req.body);
  res.status(201).json(trabalho);
});

export const listarPorAluno = asyncHandler(async (req, res) => {
  res.json(trabalhosService.listar({ alunoId: req.params.alunoId }));
});
