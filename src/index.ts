
import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req, res) => res.send('Nomina-backend running'));
app.use('/users', userRoutes);

app.listen(PORT, () => console.log(`Backend: http://localhost:${PORT}`));

