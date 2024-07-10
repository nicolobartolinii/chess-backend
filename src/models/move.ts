import { SingletonDBConnection } from '../db/sequelizeConnection';
import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { Player } from './player';
import { Game } from './game';

const db_connection: Sequelize = SingletonDBConnection.getInstance();

class Move extends Model<InferAttributes<Move>, InferCreationAttributes<Move>> {
    declare player_id: CreationOptional<number | null>;
    declare game_id: number; // foreign key
    declare move_number: number; // number of the move in the match
    declare from_position: CreationOptional<string | null>; // position of the piece before the move. If null, the player abandoned the match
    declare to_position: CreationOptional<string | null>; // position of the piece after the move. If null, the player abandoned the match
    declare configuration_after: any;  // JSON
    declare piece: CreationOptional<string | null>; // piece moved. If null, the player abandoned the match
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