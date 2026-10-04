import { Router } from 'express';
import * as alunosController from '../../controllers/alunos.controller.js';

const router = Router();

router.get('/', alunosController.listar);
router.post('/', alunosController.criar);
router.get('/:id', alunosController.buscarPorId);
router.put('/:id', alunosController.atualizar);
router.delete('/:id', alunosController.remover);

export default router;
