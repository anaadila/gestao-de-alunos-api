import { Router } from 'express';
import * as disciplinasController from '../../controllers/disciplinas.controller.js';

const router = Router();

router.get('/', disciplinasController.listar);
router.post('/', disciplinasController.criar);
router.get('/:id', disciplinasController.buscarPorId);
router.put('/:id', disciplinasController.atualizar);
router.delete('/:id', disciplinasController.remover);
router.post('/:id/matriculas', disciplinasController.matricular);
router.get('/:id/alunos', disciplinasController.listarAlunos);

export default router;
