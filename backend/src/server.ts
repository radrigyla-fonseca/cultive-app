import express from 'express'; // Biblio express
import cors from 'cors'; // Cross Origin Resource Sharing
import * as dotenv from 'dotenv';

/* ================================
  ROTAS
================================ */
import relatoriosRoutes from './routes/relatorios.routes';
import monitoramentoRoutes from './routes/monitoramento.routes';
import estufasRoutes from './routes/estufas.routes';

const app = express();
dotenv.config(); // Carrega as variáveis de ambiente

app.use(cors()); // Middleware - processo intermediário de uma requisição
app.use(express.json()); // Interprete as requisições em json

// Rotas
app.use('/api/relatorios', relatoriosRoutes);   
app.use('/api/monitoramento', monitoramentoRoutes);
app.use('/api/estufas', estufasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Servidor rodando na porta ${PORT}`)});