import {IBaseRepository} from './baseRepository';
import {Game} from '../models/game';
import {Statuses} from "../utils/statuses";
import {CreationAttributes, Op} from "sequelize";

/**
 * Interface for the Game repository. Extends the {@link IBaseRepository} interface.
 *
 * @interface IGameRepository
 * @extends {IBaseRepository<Game>}
 *
 * @function create - Creates a new game
 * @function findById - Retrieves a game by its ID
 * @function findFinishGames - Retrieves all active games
 * @function findByPlayer - Retrieves all games where a player is involved
 * @function updateGameStatus - Updates the status of a game
 */
export interface IGameRepository extends IBaseRepository<Game> {
    create(item: CreationAttributes<Game>): Promise<Game>;

    findById(id: number): Promise<Game | null>;

    findFinishGames(): Promise<Game[]>;

    findByPlayer(playerId: number, filterField?: string, filterValue?: any): Promise<Game[]>;

    findActiveGameByPlayer(playerId: number): Promise<Game | null>;

    updateGameStatus(gameId: number, status: string): Promise<[number, Game[]]>;
}

/**
 * Game repository class. Implements the {@link IGameRepository} interface.
 *
 * @class GameRepository
 * @implements {IGameRepository}
 */
export class GameRepository implements IGameRepository {
    /**
     * Retrieves all games from the database.
     *
     * @returns {Promise<Game[]>} - A promise that resolves with an array of all games.
     */
    async findAll(): Promise<Game[]> {
        return Game.findAll();
    }

    /**
     * Retrieves a game by its ID.
     *
     * @param {number} id - The ID of the game
     *
     * @returns {Promise<Game | null>} - A promise that resolves with the game if found, otherwise null.
     */
    async findById(id: number): Promise<Game | null> {
        return Game.findByPk(id);
    }

    /**
     * Creates a new game.
     *
     * @param {CreationAttributes<Game>} item - The game to be created
     *
     * @returns {Promise<Game>} - A promise that resolves with the created game.
     */
    async create(item: CreationAttributes<Game>): Promise<Game> {
        return Game.create(item);
    }

    /**
     * Updates a game by its ID.
     *
     * @param {number} id - The ID of the game
     * @param {Partial<Game>} item - The fields to be updated
     *
     * @returns {Promise<[number, Game[]]>} - A promise that resolves with the number of updated rows and the updated game.
     */
    async update(id: number, item: Partial<Game>): Promise<[number, Game[]]> {
        return Game.update(item, {where: {game_id: id} as any, returning: true});
    }

    /**
     * Deletes a game by its ID.
     *
     * @param {number} id - The ID of the game
     *
     * @returns {Promise<number>} - A promise that resolves with the number of deleted rows.
     */
    async delete(id: number): Promise<number> {
        return Game.destroy({where: {game_id: id} as any});
    }

    /**
     * Retrieves all FinishGames games from the database.
     *
     * @returns {Promise<Game[]>} - A promise that resolves with an array of all finish games.
     */
    async findFinishGames(): Promise<Game[]> {
        return Game.findAll({where: {game_status: Statuses.FINISHED} as any});
    }

    /**
     * Retrieves all games where a player is involved.
     *
     * @param {number} playerId - The ID of the player
     * @param {string} [filterField] - The field to filter by
     * @param {any} [filterValue] - The value to filter by
     *
     * @returns {Promise<Game[]>} - A promise that resolves with an array of all games where the player is involved.
     */
    async findByPlayer(playerId: number, filterField?: string, filterValue?: any): Promise<Game[]> {
        const whereClause: any = {
            [Op.or]: [{player_1_id: playerId}, {player_2_id: playerId}]
        };

        if (filterField && filterValue !== undefined) {
            whereClause[filterField] = {
                [Op.gte]: filterValue
            };
        }

        try {
            return await Game.findAll({
                where: whereClause
            });
        } catch (error) {

            throw error;
        }
    }

    /**
     * Retrieves the active game where a player is involved.
     *
     * @param {number} playerId - The ID of the player
     *
     * @returns {Promise<Game>} - A promise that resolves with the active game where the player is involved.
     */
    async findActiveGameByPlayer(playerId: number): Promise<Game | null> {
        return Game.findOne({
            where: {
                [Op.or]: [{player_1_id: playerId}, {player_2_id: playerId}],
                game_status: Statuses.ACTIVE
            }
        });
    }

    /**
     * Updates the status of a game.
     *
     * @param {number} gameId - The ID of the game
     * @param {Statuses} status - The new status of the game
     *
     * @returns {Promise<[number, Game[]]>} - A promise that resolves with the number of updated rows and the updated game.
     */
    async updateGameStatus(gameId: number, status: Statuses): Promise<[number, Game[]]> {
        return Game.update({game_status: status}, {where: {game_id: gameId} as any, returning: true});
    }
}