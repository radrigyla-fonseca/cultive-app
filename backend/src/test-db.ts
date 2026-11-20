import { pool } from './config/database';

async function testConnection() {
    try {
        const result = await pool.query(`
            SELECT
                NOW() AS horario,
                current_database() AS banco,
                current_user AS usuario
        `);

        console.log('Conexão estabelecida com sucesso!');
        console.log('Resultado:', result.rows[0]);

    } catch (error) {
        console.error('Erro ao conectar ao PostgreSQL:', error);

    } finally {
        await pool.end();
    }
}

testConnection();