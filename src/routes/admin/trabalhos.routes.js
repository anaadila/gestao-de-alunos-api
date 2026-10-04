import { Router } from 'express';
import * as trabalhosController from '../../controllers/trabalhos.controller.js';

const router = Router();

router.get('/', trabalhosController.listar);
router.get('/:id', trabalhosController.buscarPorId);
router.put('/:id', trabalhosController.corrigir);
router.delete('/:id', trabalhosController.remover);

export default router;
