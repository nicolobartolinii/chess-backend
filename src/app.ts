import express, { Request, Response } from 'express';

const jsChessEngine = require('js-chess-engine');
const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World with Express and TypeScript!');
});

app.get('/prova', (req: Request, res: Response) => {
    const game = new jsChessEngine.Game();
    res.send(game.exportJson());
});

export default app;
