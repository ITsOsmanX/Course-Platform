import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js'; 
import courseRoutes from './routes/courseRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js'; 
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app: Application = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Global Middleware Configuration
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true 
}));


app.use('/api/payments', paymentRoutes);


// 💡 FIX: JSON body parser is now at the top, BEFORE routes execute
app.use(express.json());
app.use(cookieParser()); 


// Mount Routing Entry Points

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Backend is up and running safely!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server navigating smoothly on port ${PORT} in ${process.env.NODE_ENV} mode.`);
});