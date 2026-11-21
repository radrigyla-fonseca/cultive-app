import express from 'express'; // Biblio express
import cors from 'cors'; // Cross Origin Resource Sharing
import * as dotenv from 'dotenv';
import { ResponseAPI } from './utils/response'

/* ================================
  ROTAS
================================ */
import relatoriosRoutes from './routes/relatorios.routes';
import monitoramentoRoutes from './routes/monitoramento.routes';
import estufasRoutes from './routes/estufas.routes';

const app = express();
dotenv.config(); // Carrega as variáveis de ambiente

// CORS
const allowedOrigins = [
  // 'http://localhost:8100',
  'http://localhost:4200',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({ // Middleware - processo intermediário de uma requisição
  origin: allowedOrigins
}));

app.use(express.json()); // Interprete as requisições em json

// Rota de saúde para o Render
app.get('/health', (req, res) => {
  return ResponseAPI(
    res,
    200,
    null,
    'cultive-backend'
  );
});


// Rotas
app.use('/api/relatorios', relatoriosRoutes);   
app.use('/api/monitoramento', monitoramentoRoutes);
app.use('/api/estufas', estufasRoutes);


const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => { console.log(`Servidor rodando na porta ${PORT}`)});