import { Request, Response } from 'express';
import { ResponseAPI } from '../utils/response';
import { getEstufasOnline } from '../config/influx';

export async function getEstufasOnlineController(req: Request, res: Response) {
    try {
        // Retorna as estufas que enviaram dados dentro de 11 minutos (660)
        const estufasOnline = await getEstufasOnline(660);

        ResponseAPI(
            res, 
            200, 
            estufasOnline, 
            'Sucesso na busca por estufas online'
        );
    } catch (error) {
        const details = error instanceof Error ? 
            error.message : 
            'Erro desconhecido';
        
        ResponseAPI(res, 500, { detalhes: details });
    }
};