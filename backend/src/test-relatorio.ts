
import { gerarRelatorioDiario } from './services/relatorios.service';
import { pool } from './config/database';

async function testar() {
    try {
        const resultado = await gerarRelatorioDiario('1', '2026-11-07');

        console.log('Relatório gerado com sucesso!');
        console.log(resultado);

    } catch (error) {
        console.error('Falha no teste:', error);

    } finally {
        await pool.end();
    }
}

testar();
