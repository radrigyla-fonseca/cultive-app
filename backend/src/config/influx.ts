import { InfluxDB } from '@influxdata/influxdb-client';
import * as dotenv from 'dotenv';
import { format } from 'node:path';

/* ================================
  MODELS
================================ */
import { 
    EstufaOnline, 
    EstufaData,
    Temperatura,
    Reservatorio
} from '../models/estufa.model';
import { 
    InfluxEstufasOnline, 
    InfluxEstufaData, 
    InfluxTemperatura, 
    InfluxReservatorio 
} from '../models/influx.model';

dotenv.config();

const influxUrl = process.env.INFLUX_URL;
const influxToken = process.env.INFLUX_TOKEN;
const influxOrg = process.env.INFLUX_ORG;

if(!influxUrl) throw new Error("[influx.ts]: URL de conexão do InfluxDB ausente");
if(!influxToken) throw new Error("[influx.ts]: TOKEN de acesso ao InfluxDB ausente");
if(!influxOrg) throw new Error("[influx.ts]: ORG do InfluxDB ausente");

const client = new InfluxDB({ 
    url: influxUrl, 
    token: influxToken 
});
const queryApi = client.getQueryApi(influxOrg);
const bucket = `from(bucket: "${process.env.INFLUX_BUCKET}")`;
const medicoes = `|> filter(fn: (r) => r["_measurement"] == "medicoes")`;

// Retorna as estufas que enviaram dados recentemente (11 minutos)
export async function getEstufasOnline(
    frequency: number = 660
): Promise<EstufaOnline[]> {
    try {
        const fluxQuery = `
            ${bucket}
            |> range(start: -${frequency}s)
            ${medicoes}
            |> filter(fn: (r) => exists r["estufa_id"])
            |> filter(fn: (r) =>
                contains(
                    value: r["_field"],
                    set: ["lum", "temperatura", "um_ar", "um_solo"]
                )
            )
            |> group(columns: ["estufa_id"])
            |> pivot(
                rowKey: ["_time"],
                columnKey: ["_field"],
                valueColumn: "_value"
            )
            |> group(columns: ["estufa_id"])
            |> sort(columns: ["_time"], desc: true)
            |> limit(n: 1)
        `;

        const estufasOnline = await queryApi.collectRows<InfluxEstufasOnline>(fluxQuery);

        return estufasOnline.map(estufaOnline => ({
            id: String(estufaOnline.estufa_id),
            lastSeen: estufaOnline._time,
            variables: {
                lum: estufaOnline.lum,
                temperatura: estufaOnline.temperatura,
                um_ar: estufaOnline.um_ar,
                um_solo: estufaOnline.um_solo
            }
        }))

    } catch(error) {
        console.error("[InfluxDB] Erro ao buscar estufas online:", error);
        throw new Error("Ocorreu um erro ao consultar estufas online.");
    }
}

// Retorna todos os IDs das estufas cadastradas nas medições
export async function getEstufasIds(): Promise<string[]> {
    try {
        const fluxQuery = `
            ${bucket}
            |> range(start: -30d)
            ${medicoes}
            |> keep(columns: ["estufa_id"])
            |> group()
            |> distinct(column: "estufa_id")
        `;

        const rows = await queryApi.collectRows<any>(fluxQuery);

        return [
            ...new Set(
                rows
                    .map(row => String(row.estufa_id))
                    .filter(id => /^\d+$/.test(id))
            )
        ];

    } catch(error) {
        console.error('[InfluxDB] Erro ao buscar estufas:', error);
        throw new Error('Ocorreu um erro ao tentar buscar estufas cadastradas');
    }
}

// Retorna todas as medições dentro de um período
export async function getMeasurementsByPeriod(
    idEstufa: string,
    start: string,
    stop: string
): Promise<InfluxEstufaData[]> {

    try {
        if (!/^\d+$/.test(idEstufa)) {
            throw new Error('ID da estufa inválido');
        }

        const startDate = new Date(start).toISOString();
        const stopDate = new Date(stop).toISOString();

        const fluxQuery = `
            ${bucket}
            |> range(
                start: time(v: "${startDate}"),
                stop: time(v: "${stopDate}")
            )
            ${medicoes}
            |> filter(fn: (r) => r["estufa_id"] == "${idEstufa}")
            |> filter(fn: (r) =>
                contains(
                    value: r["_field"],
                    set: [
                        "co2",
                        "lum",
                        "temperatura",
                        "um_ar",
                        "um_solo",
                        "reservatorio"
                    ]
                )
            )
        `;

        const rows = await queryApi.collectRows<InfluxEstufaData>(fluxQuery);

        return rows;
    }
    catch(error) {
        console.error('[InfluxDB] Erro ao consultar medições do relatório:', error);
        throw new Error('Erro ao consultar medições do relatório.');
    }
}

// Retorna os últimos dados da estufa com o id informado
export async function getDataEstufa(idEstufa: string) {
    try {
        const fluxQuery = `
            ${bucket}
            |> range(start: -30d)
            ${medicoes}
            |> filter(fn: (r) => r["estufa_id"] == ${idEstufa})
            |> last()
        `;
        const dataEstufa = await queryApi.collectRows<InfluxEstufaData>(fluxQuery);
    
        if(!dataEstufa.length) return null;

        if (dataEstufa.length === 0) return null;

        const firstEstufa = dataEstufa[0];

        if (!firstEstufa) return null;

        const timestampInflux = firstEstufa._time;
        const dateInflux = new Date(timestampInflux); // Converte o timestamp para data
        const formatter = new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'America/Recife',
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hourCycle: 'h23'
        });
        // Objeto contendo array ex.: type: "day", value: 07
        const parts = formatter.formatToParts(dateInflux); 

        const part = (type: string) =>
        /*
            Procure no array um objeto que receba o mesmo valor passado no parâmetro type
            Se achar, atribua à variável "part" o conteúdo da chave "value"
            Caso contrário, atribua vazio
            Ex.: 
                part(type = 'hour')
                - Find: "Achei, toma: "
                    type: "hour"
                    value: "14"
                const part = 14 
        */ 
        parts.find(p => p.type === type)?.value
        ?? '';

        const hour = Number(part('hour'));
        const minute = Number(part('minute'));
        const time = `${String(hour).padStart(2, '0')}:` +
                        `${String(minute).padStart(2, '0')}`;
        const day = Number(part('day'));
        const month = Number(part('month'));
        const year = Number(part('year'));
        const date = `${String(day).padStart(2, '0')}/` +
                        `${String(month).padStart(2, '0')}/` +
                        `${String(year)}`;

        const data: EstufaData = {
            timestamp: {
                time,
                hour,
                minute,
                date,
                month,
                year
            },
            ...Object.fromEntries( // Chave-valor
                dataEstufa.map((row: any) => [
                    row._field,
                    row._value
                ])
            )
        };
        return data;
    }
    catch(error) {
        console.log("[InfluxDB] Erro ao consultar dados da estufa:", error);
        throw new Error("Ocorreu um erro ao tentar consultar os dados da estufa.");
    }
}

// Retorna temperaturas em um período caso o rangeDays possua valor diferente de 0
export async function getTemperatures(rangeDays?: number): Promise<Temperatura[]> {
    try {
        const fluxQuery = `
            ${bucket}
            ${rangeDays ? `|> range(start: -${rangeDays}d)` : `|> range(start: ` + 0 + `)`}
            ${medicoes}
            |> filter(fn: (r) => r["_field"] == "temperatura")
            `;
            // |> group()
            // |> sort(columns: ["_time"], desc: false)
        const rows = await queryApi.collectRows(fluxQuery);
    
        return (rows as InfluxTemperatura[]).map((row): Temperatura => ({
            time: row._time,
            value: row._value
        }));
    }
    catch(error) {
        console.error("[InfluxDB] Erro ao consultar temperaturas:", error);
        throw new Error("Ocorreu um erro ao tentar consultar os dados de temperatura.");
    }
}

// Retorna o nível do reservatório com base no id
export async function getNivelReservatorio(idEstufa: string) {
    try {
        const fluxQuery = `
            ${bucket}
            |> range(start: -30d)
            ${medicoes}
            |> filter(fn: (r) => r["estufa_id"] == "${idEstufa}")
            |> filter(fn: (r) => r["_field"] == "reservatorio")
            |> last()
            `;
        const level = await queryApi.collectRows(fluxQuery);
    
        // Retorna um objeto mapeado com estrutura da interface Reservatório
        return (level as InfluxReservatorio[]).map((level): Reservatorio => ({
            value: level._value
        }));
    }
    catch(error) {
        console.error("[InfluxDB] Erro ao consultar nível do reservatório:", error);
        throw new Error("Ocorreu um erro ao tentar consultar os dados de nível do reservatório.");
    }
}