import { SingletonDBConnection } from './sequelizeConnection';
import { Sequelize, Model, DataTypes } from 'sequelize';

const db_connection: Sequelize = SingletonDBConnection.getInstance();

export class Player extends Model {}

Player.init(
    {
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
        role: {
            type: DataTypes.STRING,
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
        },
    },
    {
        sequelize: db_connection,
        modelName: 'Player'
    }
)