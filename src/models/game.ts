import {SingletonDBConnection} from '../db/sequelizeConnection';
import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize} from 'sequelize';
import {Player} from './player';
import {Statuses} from '../utils/statuses';

const db_connection: Sequelize = SingletonDBConnection.getInstance();

/**
 * Sequelize model representing a game.
 *
 * This model defines the schema for the 'Game' table in the database. It includes fields for
 * game identification, game status, configuration details, number of moves, start and end dates,
 * player identifiers, AI difficulty level, and winner identifier. The model does not include
 * automatic timestamp fields (createdAt and updatedAt).
 *
 * Attributes:
 *  - game_id: The primary key and auto-incrementing identifier for each game.
 *  - game_status: Enumerated string representing the game's status (e.g., active, completed).
 *  - game_configuration: JSONB field storing configuration settings for the game.
 *  - number_of_moves: Integer count of the moves made in the game.
 *  - start_date: The start date and time of the game.
 *  - end_date: Optional end date and time of the game, null if not finished.
 *  - player_1_id: Foreign key linking to the Player model for player one.
 *  - player_2_id: Optional foreign key for player two, null if a single-player game.
 *  - AI_difficulty: Optional string indicating the AI's difficulty level, null if no AI.
 *  - winner_id: Optional identifier for the winner, null if the game has not concluded.
 *
 * The model uses a singleton pattern for its database connection to ensure only one instance
 * of the connection is used.
 *
 * @param {Model} - Extends Sequelize Model to type and instance methods.
 *
 * @exports Game - A Sequelize model for games.
 */
class Game extends Model<InferAttributes<Game>, InferCreationAttributes<Game>> {
    declare game_id: CreationOptional<number>;
    declare game_status: Statuses;
    declare game_configuration: any;
    declare number_of_moves: number;
    declare start_date: Date;
    declare end_date: CreationOptional<Date | null>;
    declare player_1_id: number;
    declare player_2_id: CreationOptional<number | null>;
    declare AI_difficulty: CreationOptional<string | null>;
    declare winner_id: CreationOptional<number | null>;
    declare createdAt: CreationOptional<Date>;
}

Game.init({
    game_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    game_status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    game_configuration: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    number_of_moves: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    player_1_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Player,
            key: 'player_id'
        }
    },
    player_2_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Player,
            key: 'player_id'
        }
    },
    AI_difficulty: {
        type: DataTypes.STRING,
        allowNull: true
    },
    winner_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: db_connection,
    modelName: 'Game',
    timestamps: true
});

export {Game};