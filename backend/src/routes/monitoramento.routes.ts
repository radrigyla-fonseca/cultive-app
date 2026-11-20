import { Router } from 'express';
import { 
    getData,
    getNivelReservatorioController
} from '../controllers/monitoramento.controller';

const router = Router();

router.get('/:idEstufa', getData);
router.get('/reservatorio/:idEstufa', getNivelReservatorioController);

// Exporta o router
export default router;