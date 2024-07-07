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
        type: DataTypes.INTEGER.UNSIGNED,
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
useBcrypt(Player, {rounds: 10});

export { Player };