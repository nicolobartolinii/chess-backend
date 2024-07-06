import { SingletonDBConnection } from './sequelizeConnection';
import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';

const db_connection: Sequelize = SingletonDBConnection.getInstance();

class Moves extends Model<InferAttributes<Moves>, InferCreationAttributes<Moves>> {
    declare player_id: number; // foreign key
    declare move_number: number; // number of the move in the match
    declare from_position: string; // position of the piece before the move
    declare to_position: string; // position of the piece after the move
    declare configuration_after: any;  // JSON
    declare game_id: number; // foreign key
}

Moves.init({
    player_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'Players',
            key: 'player_id'
        }
    },
    game_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'Games',
            key: 'game_id'
        }
    },
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
}, {
    sequelize: db_connection,
    modelName: 'Moves'
});

export { Moves };