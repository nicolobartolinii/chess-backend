import {repositories} from "../repositories";
import {ErrorFactory} from "../factories/errorFactory";
import {Player} from "../models/player";

export const updatePlayerTokens = async (email: string, tokens: number):Promise<Player> => {
    const player = await repositories.player.findByEmail(email);
    if (!player) {
        throw ErrorFactory.notFound('Player not found');
    }

    const [, [updatedPlayer]] = await repositories.player.updatePlayerField(player.player_id, "tokens", tokens);
    return updatedPlayer;
}

export const checkSufficientTokens = async (playerId: number, requiredTokens: number): Promise<boolean> => {
    const player = await repositories.player.findById(playerId);
    if (!player) {
        throw ErrorFactory.notFound('Player not found');
    }
    return player.tokens >= requiredTokens;
};

export const decrementTokens = async (playerId: number, amount: number): Promise<void> => {
    const player = await repositories.player.findById(playerId);
    if (!player) {
        throw ErrorFactory.notFound('Player not found');
    }
    if (!await checkSufficientTokens(playerId, amount)){
        throw ErrorFactory.paymentRequired('Insufficient tokens');
    }
    await repositories.player.updatePlayerField(playerId, "tokens", player.tokens - amount);
};