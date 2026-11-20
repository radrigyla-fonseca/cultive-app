import cron from 'node-cron';

export function startRelatoriosScheduler() {

    cron.schedule(
        '0 21 * * *',
        async () => {
            console.log('[RELATÓRIOS] Iniciando geração diária...');

            // Aqui chamaremos o service
            // responsável por gerar os relatórios.

        },
        {
            timezone: 'America/Recife'
        }
    );

    console.log('[RELATÓRIOS] Agendamento configurado para 21h.');
}