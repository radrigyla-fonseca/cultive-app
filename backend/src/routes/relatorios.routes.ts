import { Router } from 'express';
import { getTemperatureController } from '../controllers/relatorios.controller';

const router = Router();

router.get('/temperaturas', getTemperatureController);

// Exporta o router
export default router;