import {repositories} from "../repositories";
import {ErrorFactory} from "../factories/errorFactory";
import {Player} from "../models/player";

/**
 * This function updates the token count of a player by their email address.
 * It replaces the current token count of the player with the new token count.
 *
 * @param {string} email - The email of the player
 * @param {number} tokens - The new token count of the player
 *
 * @returns {Promise<Player>} - A promise that resolves when the player's tokens are updated and returns the updated player.
 */
export const updatePlayerTokens = async (email: string, tokens: number): Promise<Player> => {
    const player = await repositories.player.findByEmail(email);
    if (!player) {
        throw ErrorFactory.notFound('Player not found');
    }

    const [, [updatedPlayer]] = await repositories.player.updatePlayerField(player.player_id, "tokens", tokens);
    return updatedPlayer;
}

/**
 * This function checks if a player has sufficient tokens to perform an action.
 * It compares the player's token count with the required token count.
 * If the player has enough tokens, it returns true. Otherwise, it returns false.
 *
 * @param {number} playerId - The ID of the player
 * @param {number} requiredTokens - The required token count
 *
 * @returns {Promise<boolean>} - A promise that resolves with a boolean indicating if the player has sufficient tokens.
 */
export const checkSufficientTokens = async (playerId: number, requiredTokens: number): Promise<boolean> => {
    const player = await repositories.player.findById(playerId);
    if (!player) {
        throw ErrorFactory.notFound('Player not found');
    }
    return player.tokens >= requiredTokens;
};

/**
 * This function decrements the token count of a player by a specified amount.
 * It subtracts the amount from the player's token count.
 *
 * @param {number} playerId - The ID of the player
 * @param {number} amount - The amount to decrement from the player's token count
 *
 * @returns {Promise<void>} - A promise that resolves when the player's tokens are decremented.
 */
export const decrementTokens = async (playerId: number, amount: number): Promise<void> => {
    const player = await repositories.player.findById(playerId);
    if (!player) {
        throw ErrorFactory.notFound('Player not found');
    }

    await repositories.player.updatePlayerField(playerId, "tokens", player.tokens - amount);
};

/**
 * This function increments the point count of a player by a specified amount.
 * It adds the amount to the player's point count.
 *
 * Note: The function uses the "-" operator to increment the player's points.
 * This is because the "+" operator would concatenate the amount as a string.
 * A very strange behavior of TypeScript :P
 *
 * @param {number} playerId - The ID of the player
 * @param {number} amount - The amount to increment the player's point count
 *
 * @returns {Promise<void>} - A promise that resolves when the player's points are incremented.
 */
export const incrementPoints = async (playerId: number, amount: number): Promise<void> => {
    const player = await repositories.player.findById(playerId);
    if (!player) {
        throw ErrorFactory.notFound('Player not found');
    }

    await repositories.player.updatePlayerField(playerId, "points", player.points - ((-1) * amount)); // Nonsense: works with "-" but not with "+". "+" creates a string concatenation even using "as number" or "parseFloat()".
}