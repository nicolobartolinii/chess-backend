import { SingletonDBConnection } from '../db/sequelizeConnection';
import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { Role } from '../utils/roles';

const useBcrypt = require('sequelize-bcrypt');

const db_connection: Sequelize = SingletonDBConnection.getInstance();

class Player extends Model<InferAttributes<Player>, InferCreationAttributes<Player>> {
    declare player_id?: number;
    declare email: string;
    declare password: string;
    declare role: Role;
    declare points: number;
    declare tokens: number;
    declare authenticate: (password: string) => Promise<boolean>;


}

Player.init({
    player_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    tokens: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize: db_connection,
    modelName: 'Player',
    timestamps: true
});

// This function adds the Bcrypt functionalities to the Player model.
// Specifically, it hashes the password before saving it to the database,
// and it provides a method to compare a plain text password with the hashed one.
// The object in the second parameter can specify the field to hash (default: 'password'),
// the number of rounds for the hashing algorithm (default: 8), and the name of the
// method to compare the passwords (default: 'authenticate').
useBcrypt(Player, {rounds: 10, field: 'password', method: 'authenticate'});

export { Player };

export async function findPlayerByEmail(email: string): Promise<Player | null> {
    return Player.findOne({where: {email}});
}

export async function orderPlayers(field: string, order: string): Promise<Player[]> {
    return Player.findAll({
        order: [[field, order]]
    });
}

// recharge tokens to player by email and amount
export async function rechargePlayerTokensmodel(email: string, amount: number): Promise<boolean> {
    try {
        const player = await findPlayerByEmail(email);
        if (player) {
            player.tokens = amount;
            await player.save();
            return true;  // Ritorna true se l'operazione ha successo
        }
        return false;  // Ritorna false se il giocatore non è trovato
    } catch (error) {
        console.error('Error recharging tokens:', error);
        return false;  // Ritorna false in caso di errore
    }
}

// spend token to player by email and amount
export async function spendToken(email: string, amount: number): Promise<boolean> {
    try {
        const player = await findPlayerByEmail(email);
        if (player) {
            player.tokens -= amount;
            await player.save();
            return true;  // Ritorna true se l'operazione ha successo
        }
        return false;  // Ritorna false se il giocatore non è trovato
    } catch (error) {
        console.error('Error spending tokens:', error);
        return false;  // Ritorna false in caso di errore
    }
}

// getplayer tokens by email
// TODO check if this function using in the code
export async function getPlayerTokens(email: string): Promise<number> {
    try {
        const player = await findPlayerByEmail(email);
        if (player) {
            return player.tokens;  // Ritorna il numero di token del giocatore
        }
        return 0;  // Ritorna 0 se il giocatore non è trovato
    } catch (error) {
        console.error('Error getting player tokens:', error);
        return 0;  // Ritorna 0 in caso di errore
    }
}

export async function checkPlayerToken(email: string, amount: number): Promise<boolean> {
    try {
        const player = await findPlayerByEmail(email);
        if (player) {
            return player.tokens >= amount;  // Ritorna true se il giocatore ha abbastanza token
        }
        return false;  // Ritorna false se il giocatore non è trovato
    } catch (error) {
        console.error('Error checking player tokens:', error);
        return false;  // Ritorna false in caso di errore
    }
}