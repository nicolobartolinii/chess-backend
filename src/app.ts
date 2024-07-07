import express, { Application } from 'express';
import bodyParser from 'body-parser';
import playerRoutes from "./routes/playerRoutes";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";

const app: Application = express();

// Global middlewares
app.use(bodyParser.json());

// Routes
app.use('', authRoutes);
app.use('/players', playerRoutes);
app.use('/admin', adminRoutes);

// Error handling middleware (must be the last middleware)
app.use(errorHandler);

export default app;