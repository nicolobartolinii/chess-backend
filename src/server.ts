import app from './app';
import {sequelize} from './models/sequelizeConnection';
import { Player } from './models/player';
import { Game } from './models/game';

// Create tables if they do not exist

Player.sync({ force: true })
    .then(() => {
        console.log('Database & tables created successfully!');
    })
    .catch((error) => {
        console.error('Error during table creation:', error);
    });



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
