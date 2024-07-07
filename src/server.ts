import express, { Application } from 'express';
import bodyParser from 'body-parser';
import playerRoutes from "./routes/playerRoutes";
import authRoutes from "./routes/authRoutes";
import adminRoutes  from "./routes/adminRoutes";
const app: Application = express();

app.use(bodyParser.json());

app.use('', authRoutes)
app.use('/players', playerRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});