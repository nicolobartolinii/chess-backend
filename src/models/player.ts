import {SingletonDBConnection} from '../db/sequelizeConnection';
import {DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize} from 'sequelize';
import {Role} from '../utils/roles';

const useBcrypt = require('sequelize-bcrypt');

const db_connection: Sequelize = SingletonDBConnection.getInstance();

/**
 * Sequelize model for players.
 *
 * This model defines the schema for the 'Player' table in the database. It includes fields for
 * player identification, username, email, password (hashed using bcrypt), role, points, and tokens.
 * It supports basic authentication methods integrated via sequelize-bcrypt to handle password security.
 *
 * Fields:
 *  - player_id: Auto-incremented primary key for player identification.
 *  - username: Unique username for the player.
 *  - email: Unique email address for the player.
 *  - password: Hashed password for secure authentication.
 *  - role: Player's role defined by an enumerated type (Role).
 *  - points: Decimal field for player points, defaults to 0.
 *  - tokens: Decimal field for player tokens, defaults to 0.
 *
 * The model includes automatic timestamping for 'createdAt' and 'updatedAt' fields.
 * The bcrypt functionalities are integrated to hash the password before storage and
 * provide a method to authenticate the hashed password against a given plain text.
 *
 * @param {Model} - Extends Sequelize Model to type and instance methods.
 *
 * @exports Player - A Sequelize model for players.
 */
class Player extends Model<InferAttributes<Player>, InferCreationAttributes<Player>> {
    declare player_id: number;
    declare username: string;
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
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 0
    },
    tokens: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize: db_connection,
    modelName: 'Player',
    timestamps: true
});

/**
 * This function adds the Bcrypt functionalities to the Player model.
 * Specifically, it hashes the password before saving it to the database,
 * and it provides a method to compare a plain text password with the hashed one.
 * The object in the second parameter can specify the field to hash (default: 'password'),
 * the number of rounds for the hashing algorithm (default: 8), and the name of the
 * method to compare the passwords (default: 'authenticate').
 */
useBcrypt(Player, {rounds: 10, field: 'password', method: 'authenticate'});

export {Player};