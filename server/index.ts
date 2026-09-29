import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const __dirname = path.resolve();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Connect to Database
  try {
    await connectDB();


  } catch (error) {
    console.warn("Database connection or seeding failed. The app is running, but API routes will fail.", error);
  }

  // Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for Vite development
  }));
  app.use(cors());
  app.use(express.json());
  
  // Static uploads directory
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // API Routes
  app.get('/api/config', async (req, res) => {
    try {
      const { Config } = await import('./models/Config.js');
      let config = await Config.findOne();
      if (!config) config = await Config.create({});
      res.json(config);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });
  app.use('/api/auth', authRoutes);
  app.use('/api/student', studentRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/payment', paymentRoutes);

  // Error Handler
  app.use(errorHandler);

  // Vite middleware for development or Static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();