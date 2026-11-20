import { Request, Response } from 'express';
import { ResponseAPI } from '../utils/response';
import { getDataEstufa } from '../config/influx';
import { getNivelReservatorio } from '../config/influx';

export async function getData(req: Request, res: Response): Promise<void> {
    try {
        if(!process.env.INFLUX_BUCKET) throw new Error('[monitoramento.controller] Bucket do InfluxDB ausente');
        const idEstufa = req.params.idEstufa; // Pega o id dos parâmetros da url
        // Se não vier o id
        if(!idEstufa) {
            ResponseAPI(
                res, 
                400, 
                null, 
                "Parâmetro idEstufa ausente"
            )
            return
        }
        // Se o id não vier como string
        if (typeof idEstufa !== 'string') {
            ResponseAPI(
                res, 
                400, 
                null, 
                "Parâmetro inválido"
            )
            return
        }
        const data = await getDataEstufa(idEstufa);
        ResponseAPI(
            res, 
            200, 
            data
        );
    }
    catch(error: any) {
        const details = error instanceof Error ? 
        error.message : 
        'Erro desconhecido';

        ResponseAPI(
            res, 
            500, 
            { detalhes: details }
        )
    }
}

export async function getNivelReservatorioController(req: Request, res: Response): Promise<void> {
    try {
        if(!process.env.INFLUX_BUCKET) throw new Error('[monitoramento.controller] Bucket do InfluxDB ausente');
        const idEstufa = req.params.idEstufa; // Pega o id dos parâmetros da url
        // Se não vier o id
        if(!idEstufa) {
            ResponseAPI(
                res,
                400, 
                null, 
                "Parâmetro idEstufa ausente"
            )
            return
        }
        // Se o id não vier como string
        if (typeof idEstufa !== 'string') {
            ResponseAPI(
                res, 
                400, 
                null, 
                "Parâmetro inválido"
            )
            return
        }
        const level = await getNivelReservatorio(idEstufa);
        ResponseAPI(
            res, 
            200, 
            level
        )
    }
    catch(error: any) {
        const details = error instanceof Error ?
         error.message : 
         'Erro desconhecido';

        ResponseAPI(
            res, 
            500, 
            { detalhes: details }, 
            "Erro interno ao tentar consultar dados de nível do reservatório"
        )
    }
}