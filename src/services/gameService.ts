import {checkPlayerToken, findPlayerByEmail} from "../models/player";
import {ErrorFactory} from "../factories/errorFactory";
import {createNewGame, Game} from "../models/game";
import {Statuses} from "../utils/statuses";
const jsChessEngine = require('js-chess-engine')

export async function createGame(player_1_email: string, player_2_email?: string, AI_difficulty?: string): Promise<void> {
    if (!player_1_email) {
        throw ErrorFactory.badRequest('Player 1 email is required');
    }

    if (!await checkPlayerToken(player_1_email, 0.45)) {
        throw ErrorFactory.paymentRequired('Player 1 does not have enough tokens');
    }
    let player2 = null;
    if (player_2_email) {
        player2 = await findPlayerByEmail(player_2_email);
        if (!player2) {
            throw ErrorFactory.notFound('Player 2 not found');
        }
    }

    const player1 = await findPlayerByEmail(player_1_email);
    if (!player1) {
        throw ErrorFactory.notFound('Player 1 not found');
    }


    const game = new jsChessEngine.Game();
    const gameConfiguration = game.exportJson();
    await createNewGame(
        Statuses.ACTIVE,
        JSON.stringify(gameConfiguration),
        new Date(),
        player1.player_id,
        player2 ? player2.player_id : null,
        AI_difficulty
    );
}
