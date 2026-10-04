import { Router } from 'express';
import * as notasController from '../../controllers/notas.controller.js';

const router = Router();

router.get('/', notasController.listar);
router.post('/', notasController.criar);
router.get('/:id', notasController.buscarPorId);
router.put('/:id', notasController.atualizar);
router.delete('/:id', notasController.remover);

export default router;
