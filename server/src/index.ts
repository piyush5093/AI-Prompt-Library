import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import healthRouter from './routes/health';
import promptRoutes from './routes/promptRoutes';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', healthRouter);
app.use('/api/prompts', promptRoutes);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.info(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed', err);
    process.exit(1);
  });
