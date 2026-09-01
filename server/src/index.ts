import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { planRouter } from './routes/plan.routes';
import { profileRouter } from './routes/profile.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/api/profile', profileRouter);
app.use('/api/plan', planRouter);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
