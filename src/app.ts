import express, { Application } from 'express';
import bodyParser from 'body-parser';
import playerRoutes from "./routes/playerRoutes";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";
import gameRoutes from "./routes/gameRoutes";

const app: Application = express();

app.use(bodyParser.json());

app.use('', authRoutes);
app.use('/players', playerRoutes);
app.use('/admin', adminRoutes);
app.use('/games', gameRoutes);

app.use(errorHandler);

export default app;