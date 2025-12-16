
import express from 'express';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import CategorieRoutes from './routes/CategorieRoutes';
import CultureRoutes from './routes/CultureRoutes';
import NomPersonnageRoutes from './routes/NomPersonnageRoutes';
import FragmentsHistoireRoutes from './routes/FragmentsHistoireRoutes';
import TitreRoutes from './routes/TitreRoutes';
import ConceptRoutes from './routes/ConceptRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req, res) => res.send('Nomina-backend running'));
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/categories', CategorieRoutes);
app.use('/cultures', CultureRoutes);
app.use('/nomPersonnages', NomPersonnageRoutes);
app.use('/fragmentsHistoire', FragmentsHistoireRoutes);
app.use('/titres', TitreRoutes);
app.use('/concepts', ConceptRoutes);

app.listen(PORT, () => console.log(`Backend: http://localhost:${PORT}`));

