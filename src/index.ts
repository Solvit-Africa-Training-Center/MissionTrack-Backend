import express from 'express';
import { config } from 'dotenv';
import redis from './utils/redis';
import { errorLogger, logStartup } from './utils/logger';
import { database } from './database';
import i18n from './config/i18n';
import userRoutes from './routes/userRoutes';
import swaggerDocs from './swagger'; // Make sure this import is correct

config();

const app = express();

// Middleware
app.use(express.json());
app.use(i18n.init);

// Connect to Redis
redis.connect().catch((err) => console.log("Redis connection error", err));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Mission Track Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/users', userRoutes);

// Initialize Swagger documentation
// This should be after your API routes but before the 404 handler
const PORT = parseInt(process.env.PORT as string) || 5500;
swaggerDocs(app, PORT);

// 404 handler - MUST be after all other routes and middleware
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorLogger(error, 'Unhandled Error');
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

// Database connection and server startup
database.sequelize.authenticate().then(async () => {
  try {
    app.listen(PORT, () => {
      logStartup(PORT, process.env.NODE_ENV || 'DEV');
    });
  } catch (error) {
    errorLogger(error as Error, 'Error starting server');
  }
}).catch((error: Error) => {
  errorLogger(error, 'Database connection error');
});

export default app;