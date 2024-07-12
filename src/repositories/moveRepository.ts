import {IBaseRepository} from './baseRepository';
import {Move} from '../models/move';
import {CreationAttributes} from "sequelize";

/**
 * Interface for the Move repository. Extends the {@link IBaseRepository} interface.
 *
 * @interface IMoveRepository
 * @extends {IBaseRepository<Move>}
 *
 * @function create - Creates a new move
 * @function findByGame - Retrieves all moves from a game
 * @function findLastMoveByGame - Retrieves the last move from a game
 */
export interface IMoveRepository extends IBaseRepository<Move> {
    create(item: CreationAttributes<Move>): Promise<Move>;

    findByGame(gameId: number): Promise<Move[]>;

    findLastMoveByGame(gameId: number): Promise<Move | null>;
}

/**
 * Move repository class. Implements the {@link IMoveRepository} interface.
 *
 * @class MoveRepository
 * @implements {IMoveRepository}
 */
export class MoveRepository implements IMoveRepository {
    /**
     * Retrieves all moves from the database.
     *
     * @returns {Promise<Move[]>} - A promise that resolves with an array of all moves.
     */
    async findAll(): Promise<Move[]> {
        return Move.findAll();
    }

    /**
     * Creates a new move.
     *
     * @param {CreationAttributes<Move>} item - The move to create
     *
     * @returns {Promise<Move>} - A promise that resolves with the created move.
     */
    async create(item: CreationAttributes<Move>): Promise<Move> {
        return Move.create(item);
    }

    /**
     * Updates a move.
     *
     * @param {number} id - The ID of the move to update
     * @param {Partial<Move>} item - The fields to update
     *
     * @returns {Promise<[number, Move[]]>} - A promise that resolves with the number of affected rows and the updated moves.
     */
    async update(id: number, item: Partial<Move>): Promise<[number, Move[]]> {
        return Move.update(item, {where: {id}, returning: true} as any);
    }

    /**
     * Deletes a move.
     *
     * @param {number} id - The ID of the move to delete
     *
     * @returns {Promise<number>} - A promise that resolves with the number of deleted rows.
     */
    async delete(id: number): Promise<number> {
        return Move.destroy({where: {id}} as any);
    }

    /**
     * Retrieves all moves from a game.
     *
     * @param {number} gameId - The ID of the game
     *
     * @returns {Promise<Move[]>} - A promise that resolves with an array of all moves from the game.
     */
    async findByGame(gameId: number): Promise<Move[]> {
        return Move.findAll({where: {game_id: gameId}, order: [['move_number', 'ASC']]} as any);
    }

    /**
     * Retrieves the last move from a game.
     *
     * @param {number} gameId - The ID of the game
     *
     * @returns {Promise<Move | null>} - A promise that resolves with the last move from the game, or null if no moves are found.
     */
    async findLastMoveByGame(gameId: number): Promise<Move | null> {
        return Move.findOne({
            where: {game_id: gameId},
            order: [['move_number', 'DESC']]
        } as any);
    }
}