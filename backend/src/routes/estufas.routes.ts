import { Router } from 'express';
import { 
    getEstufasOnlineController,
} from '../controllers/estufas.controller';

const router = Router();

router.get('/online', getEstufasOnlineController);

// Exporta o router
export default router;