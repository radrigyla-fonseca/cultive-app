import { Request, Response } from 'express';
import { getTemperatures } from '../config/influx';
import { ResponseAPI } from '../utils/response';

export async function getTemperatureController(req: Request, res: Response): Promise<void> {
    try {
        if(!process.env.INFLUX_BUCKET) throw new Error('[relatorios.controller] Bucket do InfluxDB ausente');
        const temperatures = await getTemperatures();
        ResponseAPI(res, 200, temperatures);
    }
    catch(error: any) {
        const details = error instanceof Error ? error.message : 'Erro desconhecido';

        ResponseAPI(res, 500, { detalhes: details }, "Erro interno ao tentar consultar dados de temperatura");
    }
}