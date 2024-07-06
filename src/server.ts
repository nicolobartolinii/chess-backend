
import express, { Application } from 'express';
import playerRoutes from "./routes/playerRoutes";
const app: Application = express();

app.use('/players', playerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});