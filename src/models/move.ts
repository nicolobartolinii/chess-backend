import { SingletonDBConnection } from '../db/sequelizeConnection';
import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { Player } from './player';
import { Game } from './game';

const db_connection: Sequelize = SingletonDBConnection.getInstance();

/**
 * Sequelize model representing a move made in a game.
 *
 * This model defines the schema for the 'Move' table in the database, tracking each move's details within a game.
 * It includes fields for linking to the player and the game, the move number, positions before and after the move,
 * the configuration of the game after the move, and the specific piece moved. If certain fields are null, it indicates
 * that the player abandoned the match at this move.
 *
 * Fields:
 *  - player_id: Foreign key to the 'Player' model. Nullable if the move was automatically generated.
 *  - game_id: Foreign key to the 'Game' model, linking the move to a specific game.
 *  - move_number: The sequence number of the move within the game.
 *  - from_position: The starting position of the piece; null if the player abandoned the game.
 *  - to_position: The ending position of the piece; null if the player abandoned the game.
 *  - configuration_after: JSON object describing the game configuration after the move.
 *  - piece: The type of piece moved; null if the player abandoned the game.
 *
 * Configuration:
 *  - The model is linked to the singleton Sequelize database connection instance.
 *  - It is indexed on the combination of player_id, game_id, and move_number to ensure uniqueness.
 *  - The default 'id' attribute provided by Sequelize is removed to use a composite key instead.
 *
 * @param {Model} - Extends Sequelize Model to type and instance methods.
 *
 * @exports Move - A Sequelize model for game moves.
 */
class Move extends Model<InferAttributes<Move>, InferCreationAttributes<Move>> {
    declare player_id: CreationOptional<number | null>;
    declare game_id: number; // foreign key
    declare move_number: number; // number of the move in the match
    declare from_position: CreationOptional<string | null>; // position of the piece before the move. If null, the player abandoned the match
    declare to_position: CreationOptional<string | null>; // position of the piece after the move. If null, the player abandoned the match
    declare configuration_after: any;  // JSON
    declare piece: CreationOptional<string | null>; // piece moved. If null, the player abandoned the match
    declare createdAt: CreationOptional<Date>;
}

Move.init({
    player_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: Player,
            key: 'player_id'
        }
    },
    game_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Game,
            key: 'game_id'
        }
    },
    move_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    from_position: {
        type: DataTypes.STRING,
        allowNull: true
    },
    to_position: {
        type: DataTypes.STRING,
        allowNull: true
    },
    configuration_after: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    piece: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: db_connection,
    modelName: 'Move',
    indexes: [
        {
            unique: true,
            fields: ['player_id', 'game_id', 'move_number']
        }
    ]
});

Move.removeAttribute('id');

export { Move };