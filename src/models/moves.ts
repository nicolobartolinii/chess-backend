import { SingletonDBConnection } from './sequelizeConnection';
import { Sequelize, Model, DataTypes } from 'sequelize';

const db_connection: Sequelize = SingletonDBConnection.getInstance();

export class Moves extends Model {}

Moves.init(
    {
        move_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        from_position: {
            type: DataTypes.STRING,
            allowNull: false
        },
        to_position: {
            type: DataTypes.STRING,
            allowNull: false
        },
        configuration_after: {
            type: DataTypes.JSON,
            allowNull: false
        }
    },
    {
        sequelize: db_connection,
        modelName: 'Moves'
    }
)