
import { pool } from '../config/database';
import {
    getMeasurementsByPeriod,
    InfluxEstufaData
} from '../config/influx';

const TIMEZONE = 'America/Recife';
const SENSORES = [
    'co2',
    'lum',
    'temp',
    'um_ar',
    'um_solo',
    'reserv'
] as const;

interface SensorIndicators {
    media: number | null;
    min: number | null;
    max: number | null;
}

interface RelatorioDiario {
    estufa_id: number;
    data: string;
    periodo_inicio: string;
    periodo_fim: string;
    [key: string]: string | number | null;
}

// Retorna a data atual no fuso de Recife
function getDataRecife(): string {
    const parts = new Intl.DateTimeFormat('en-CA', { // Formato canadense
        timeZone: TIMEZONE, // Fuso-horário
        year: 'numeric', // Ano completo
        month: '2-digit', // Mês com dois dígitos
        day: '2-digit' // ex.: 08
    }).formatToParts(new Date()); // Separa o instante exato em partes 

    const values = Object.fromEntries( // Transforma as partes em objeto json
        parts.
        // Gera um novo array [type, value]
        map(part => [part.type, part.value])
        /* Exemplo de saída:
            {
                'mês': 01, 'dia': 15, 'ano': 2026

            }
        */
    );

    return `${values.year}-${values.month}-${values.day}`;
}

// Calcula os indicadores de um sensor
function calculateIndicators(values: number[]): SensorIndicators {

    // Se valores dos sensores vierem vazios, retorna indicadores vazios
    if (values.length === 0) {
        return {
            media: null,
            min: null,
            max: null
        };
    }

    // Soma de todos os valores de values
    const sum = values.reduce((acc, value) => acc + value, 0);

    return {
        // Limita em 2 casas decimais e transforma em number
        media: Number((sum / values.length).toFixed(2)), 
        min: Math.min(...values),
        max: Math.max(...values) // Ex.: max(21, 23, 11, 20, 17)
    };
}

// Calcula o período de 21h até 21h
function getPeriod(data: string) {

    const [year, month, day] = data.split('-').map(Number);

    if (
        year === undefined ||
        month === undefined ||
        day === undefined ||
        !Number.isInteger(year) ||
        !Number.isInteger(month) ||
        !Number.isInteger(day) ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
    ) {
        throw new Error('Data inválida para gerar o período.');
    }

    const validatedDate = new Date(Date.UTC(year, month - 1, day));

    if (
        validatedDate.getUTCFullYear() !== year ||
        validatedDate.getUTCMonth() !== month - 1 ||
        validatedDate.getUTCDate() !== day
    ) {
        throw new Error('Data de referência inexistente.');
    }

    const previousDate = new Date(
        Date.UTC(year, month - 1, day - 1)
    );

    const previousDay = [
        previousDate.getUTCFullYear(),
        String(previousDate.getUTCMonth() + 1).padStart(2, '0'),
        String(previousDate.getUTCDate()).padStart(2, '0')
    ].join('-');

    return {
        start: `${previousDay}T21:00:00-03:00`,
        stop: `${data}T21:00:00-03:00`
    };
}

// Organiza os dados retornados pelo InfluxDB
function processMeasurements(
    estufaId: number,
    data: string,
    start: string,
    stop: string,
    rows: InfluxEstufaData[]
): RelatorioDiario {

    const report: RelatorioDiario = {
        estufa_id: estufaId,
        data,
        periodo_inicio: new Date(start).toISOString(),
        periodo_fim: new Date(stop).toISOString()
    };

    for (const sensor of SENSORES) {

        const values = rows
            .filter(row => row._field === sensor)
            .map(row => Number(row._value))
            .filter(value => Number.isFinite(value));

        const stats = calculateIndicators(values);

        report[`${sensor}_media`] = stats.media;
        report[`${sensor}_min`] = stats.min;
        report[`${sensor}_max`] = stats.max;
    }

    return report;
}

// Gera e salva o relatório diário
export async function gerarRelatorioDiario(
    idEstufa: string,
    dataReferencia?: string
): Promise<RelatorioDiario> {

    if (!/^\d+$/.test(idEstufa)) {
        throw new Error('ID da estufa inválido.');
    }

    const data = dataReferencia ?? getDataRecife();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        throw new Error('Data de referência inválida.');
    }

    const { start, stop } = getPeriod(data);

    // Impede gerar um relatório de um período ainda não encerrado
    if (new Date(stop).getTime() > Date.now()) {
        throw new Error(
            'O período de coleta ainda não foi encerrado.'
        );
    }

    try {

        // 1. Consultar o InfluxDB
        const rows = await getMeasurementsByPeriod(
            idEstufa,
            start,
            stop
        );

        if (rows.length === 0) {
            throw new Error(
                'Nenhuma medição encontrada para o período informado.'
            );
        }

        // 2. Calcular estatísticas
        const relatorio = processMeasurements(
            Number(idEstufa),
            data,
            start,
            stop,
            rows
        );

        // 3. Preparar os campos do PostgreSQL
        const columns = [
            'estufa_id',
            'data',
            'periodo_inicio',
            'periodo_fim',
            ...SENSORES.flatMap(sensor => [
                `${sensor}_media`,
                `${sensor}_min`,
                `${sensor}_max`
            ])
        ];

        const values = columns.map(column => relatorio[column]);

        const placeholders = values
            .map((_, index) => `$${index + 1}`)
            .join(', ');

        const updateColumns = columns
            .filter(column => !['estufa_id', 'data'].includes(column))
            .map(column => `"${column}" = EXCLUDED."${column}"`)
            .join(', ');

        // 4. Salvar ou atualizar o relatório
        const sql = `
            INSERT INTO relatorios (
                ${columns.map(column => `"${column}"`).join(', ')}
            )
            VALUES (${placeholders})
            ON CONFLICT (estufa_id, data)
            DO UPDATE SET
                ${updateColumns},
                created_at = NOW()
            RETURNING *
        `;

        const result = await pool.query(sql, values);

        console.log(
            `[RELATÓRIOS] Relatório da estufa ${idEstufa} salvo: ${data}`
        );

        return result.rows[0];

    } catch (error) {

        console.error(
            '[RELATÓRIOS] Erro ao gerar relatório:',
            error
        );

        throw error;
    }
}
