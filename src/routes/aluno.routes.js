import { Router } from 'express';
import * as alunosController from '../controllers/alunos.controller.js';
import * as trabalhosController from '../controllers/trabalhos.controller.js';
import authenticate from '../middlewares/authenticate.js';
import authorizeSelfOrAdmin from '../middlewares/authorizeSelfOrAdmin.js';

const router = Router();

// Autoatendimento: exige um usuário autenticado, que seja o próprio aluno ou um admin.
router.use(authenticate);

router.get('/:alunoId/disciplinas', authorizeSelfOrAdmin, alunosController.listarDisciplinas);
router.get('/:alunoId/notas', authorizeSelfOrAdmin, alunosController.listarNotas);
router.get('/:alunoId/trabalhos', authorizeSelfOrAdmin, trabalhosController.listarPorAluno);
router.post('/:alunoId/trabalhos', authorizeSelfOrAdmin, trabalhosController.registrar);

export default router;
