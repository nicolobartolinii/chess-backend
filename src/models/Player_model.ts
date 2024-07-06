import { SingletonDBConnection } from './sequelizeConnection';
import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';

const db_connection: Sequelize = SingletonDBConnection.getInstance();

class Player extends Model<InferAttributes<Player>, InferCreationAttributes<Player>> {
    declare player_id: number;
    declare email: string;
    declare role: string;
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
    }
}, {
    sequelize: db_connection,
    modelName: 'Player'
});

export { Player };