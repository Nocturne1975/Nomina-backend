import express from 'express';
import prisma from './prisma';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req, res) => res.send('Nomina-backend running'));
app.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(PORT, () => console.log(`Backend: http://localhost:${PORT}`));
