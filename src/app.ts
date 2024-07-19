import express, {Application} from 'express';
import bodyParser from 'body-parser';
import playerRoutes from "./routes/playerRoutes";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import {errorHandler} from "./middlewares/errorMiddleware";
import gameRoutes from "./routes/gameRoutes";
import {invalidRouteMiddleware} from "./middlewares/invalidRouteMiddleware";

/** Express app */
const app: Application = express();

/** Makes the app parse JSON bodies */
app.use(bodyParser.json());

/** Routes */
app.use('', authRoutes);
app.use('/players', playerRoutes);
app.use('/admin', adminRoutes);
app.use('/games', gameRoutes);

/**
 * Invalid route middleware
 *
 * Makes the app response with a custom error message when a request is made to an invalid route.
 * */
app.get('*', invalidRouteMiddleware);
app.post('*', invalidRouteMiddleware);
app.put('*', invalidRouteMiddleware);
app.patch('*', invalidRouteMiddleware);
app.head('*', invalidRouteMiddleware);
app.options('*', invalidRouteMiddleware);
app.delete('*', invalidRouteMiddleware);

/** Error handler middleware */
app.use(errorHandler);

export default app;