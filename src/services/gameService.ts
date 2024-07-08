import {ErrorFactory} from "../factories/errorFactory";
import {Statuses} from "../utils/statuses";
import {repositories} from "../repositories";
import * as constants from "../utils/constants";
import * as playerService from "./playerService";

const jsChessEngine = require('js-chess-engine')

export async function createGame(player_1_id: number, player_2_email?: string, AI_difficulty?: string): Promise<void> {
    const hasEnoughTokens = await playerService.checkSufficientTokens(player_1_id, constants.GAME_CREATE_COST);
    if (!hasEnoughTokens) {
        throw ErrorFactory.paymentRequired('Insufficient tokens');
    }

    let player2 = null;
    if (player_2_email) {
        player2 = await repositories.player.findByEmail(player_2_email);
        if (!player2) {
            throw ErrorFactory.notFound('Player 2 not found');
        }
    }

    const player_2_id = player2 ? player2.player_id : undefined;

    const game = new jsChessEngine.Game();
    const gameConfiguration = game.exportJson();

    await repositories.game.create({
        game_status: Statuses.ACTIVE,
        game_configuration: gameConfiguration,
        number_of_moves: 0,
        start_date: new Date(),
        player_1_id,
        player_2_id: player_2_id || null,
        AI_difficulty: AI_difficulty || null,
    });

    await playerService.decrementTokens(player_1_id, constants.GAME_CREATE_COST);
}

export async function getGamesHistory(player_id: number, startDate?: Date) {
    const filter_fild = 'start_date';
    const games = await repositories.game.findByPlayer(player_id,filter_fild,startDate);
    return games.map(game => ({
        game_status: game.game_status,
        number_of_moves: game.number_of_moves,
        start_date: game.start_date,
        winner_id: game.winner_id
    }));
}

export async function getGameStatus(playerId: number, gameId: number) {
    const game = await repositories.game.findById(gameId);
    if (!game) {
        throw ErrorFactory.notFound('Game not found');
    }

    if (game.player_1_id !== playerId && game.player_2_id !== playerId) {
        throw ErrorFactory.forbidden('You are not part of the game');
    }

    return {
        status: game.game_status,
        current_configuration: game.game_configuration,
        opponent: game.player_2_id ? (game.player_1_id === playerId ? game.player_2_id : game.player_1_id) : `AI-${game.AI_difficulty}`,
        turn: game.game_configuration.turn === "white" ? game.player_1_id : game.player_2_id
    };
}