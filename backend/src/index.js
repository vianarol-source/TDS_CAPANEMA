import express from 'express';
import cors from 'cors';
import licensesRouter from './routes/licenses.js';
import statesRouter from './routes/states.js';
import cnpjRouter from './routes/cnpj.js';
import carRouter from './routes/car.js';
import leadsRouter from './routes/leads.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/licenses', licensesRouter);
app.use('/api/states', statesRouter);
app.use('/api/cnpj', cnpjRouter);
app.use('/api/car', carRouter);
app.use('/api/leads', leadsRouter);

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Modo: ${process.env.USE_MOCK !== 'false' ? 'Mock' : 'API Real'}`);
});
