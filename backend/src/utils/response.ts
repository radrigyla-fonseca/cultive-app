import { Response } from 'express';

export function ResponseAPI<T>(
    res: Response,
    status: number,
    data: T | null = null, // T: qualquer tipo
    message?: string,
) {

    res.status(status).json({
        success: status >= 200 && status < 300,
        data,
        message
    });
}