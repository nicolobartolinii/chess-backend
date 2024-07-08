import {SingletonDBConnection} from '../db/sequelizeConnection';
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes} from 'sequelize';
import {Player} from './player';
import {Statuses} from '../utils/statuses';
const db_connection: Sequelize = SingletonDBConnection.getInstance();

class Game extends Model<InferAttributes<Game>, InferCreationAttributes<Game>> {}

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
        type: DataTypes.JSON,
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
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    sequelize: db_connection,
    modelName: 'Game',
    timestamps: false
});

export {Game};

// create game
export async function createNewGame(game_status: string = Statuses.ACTIVE, game_configuration: string, start_date: Date = new Date(), player_1_id: number | undefined, player_2_id: number | undefined | null, AI_difficulty: string | undefined): Promise<Game> {
    console.log("game in creation");
    return await Game.create({game_status, game_configuration, start_date, player_1_id, player_2_id, AI_difficulty});
}


