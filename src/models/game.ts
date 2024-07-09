import {SingletonDBConnection} from '../db/sequelizeConnection';
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional} from 'sequelize';
import {Player} from './player';
import {Statuses} from '../utils/statuses';
const db_connection: Sequelize = SingletonDBConnection.getInstance();


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
    }
}, {
    sequelize: db_connection,
    modelName: 'Game',
    timestamps: false
});

export {Game};