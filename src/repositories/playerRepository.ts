import { IBaseRepository } from './baseRepository';
import {Player} from "../models/player";

/**
 * Interface for the Player repository. Extends the {@link IBaseRepository} interface.
 *
 * @interface IPlayerRepository
 * @extends {IBaseRepository<Player>}
 *
 * @function findByEmail - Retrieves a player by its email
 * @function findById - Retrieves a player by its ID
 * @function updatePlayerField - Updates a field of a player
 * @function findAllOrdering - Retrieves all players ordering by a field
 */
export interface IPlayerRepository extends IBaseRepository<Player> {
    findByEmail(email: string): Promise<Player | null>;
    findById(id: number): Promise<Player | null>;
    updatePlayerField(player_id: number, field: keyof Player, value: any): Promise<[number, Player[]]>;
    findAllOrdering(field: string, order: string): Promise<Player[]>;
}

/**
 * Player repository class. Implements the {@link IPlayerRepository} interface.
 *
 * @class PlayerRepository
 * @implements {IPlayerRepository}
 */
export class PlayerRepository implements IPlayerRepository {
    /**
     * Retrieves all players from the database.
     *
     * @returns {Promise<Player[]>} - A promise that resolves with an array of all players.
     */
    async findAll(): Promise<Player[]> {
        return Player.findAll();
    }

    /**
     * Retrieves a player by its ID.
     *
     * @param {number} player_id - The ID of the player
     *
     * @returns {Promise<Player | null>} - A promise that resolves with the player if found, otherwise null.
     */
    async findById(player_id: number): Promise<Player | null> {
        return Player.findByPk(player_id);
    }

    /**
     * Retrieves a player by its email.
     *
     * @param {string} email - The email of the player
     *
     * @returns {Promise<Player | null>} - A promise that resolves with the player if found, otherwise null.
     */
    async findByEmail(email: string): Promise<Player | null> {
        return Player.findOne({ where: { email } } as any);
    }

    /**
     * Creates a new player.
     *
     * @param {Player} item - The player to be created
     *
     * @returns {Promise<Player>} - A promise that resolves with the created player.
     */
    async create(item: Player): Promise<Player> {
        return Player.create(item);
    }

    /**
     * Updates a player.
     *
     * @param {number} player_id - The ID of the player
     * @param {Partial<Player>} item - The fields to be updated
     *
     * @returns {Promise<[number, Player[]]>} - A promise that resolves with an array containing the number of updated rows and the updated player.
     */
    async update(player_id: number, item: Partial<Player>): Promise<[number, Player[]]> {
        return Player.update(item, { where: { player_id }, returning: true } as any);
    }

    /**
     * Updates a field of a player.
     *
     * @param {number} player_id - The ID of the player
     * @param {keyof Player} field - The field to be updated
     * @param {any} value - The new value of the field
     *
     * @returns {Promise<[number, Player[]]>} - A promise that resolves with an array containing the number of updated rows and the updated player.
     */
    async updatePlayerField(player_id: number, field: keyof Player, value: any): Promise<[number, Player[]]> {
        return Player.update({ [field]: value }, { where: { player_id }, returning: true } as any);
    }

    /**
     * Deletes a player.
     *
     * @param {number} player_id - The ID of the player
     *
     * @returns {Promise<number>} - A promise that resolves with the number of deleted rows.
     */
    async delete(player_id: number): Promise<number> {
        return Player.destroy({ where: { player_id } } as any);
    }

    /**
     * Retrieves all players ordering by a field.
     *
     * @param {string} field - The field to order by
     * @param {string} order - The order
     *
     * @returns {Promise<Player[]>} - A promise that resolves with an array of all players.
     */
    async findAllOrdering(field: string, order: string): Promise<Player[]> {
        return Player.findAll({
            order: [[field, order]]
        });
    }
}