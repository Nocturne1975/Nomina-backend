import express from 'express';
import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'


const app = express();
app.use(express.json());

app.use('/auth', authRoutes)
app.use('/users', userRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Notre serveur est lance sur le port ${PORT}`);
});

