import {ErrorFactory} from "../factories/errorFactory";
import {Statuses} from "../utils/statuses";
import {repositories} from "../repositories";
import * as constants from "../utils/constants";
import * as playerService from "./playerService";
import PDFDocument from 'pdfkit';

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

export async function winnerGame(player_id: number, game_id: number): Promise<Buffer> { // TODO put the name of the winner and looser, add attributes in database
    const games = await repositories.game.WinnerGame(player_id, game_id);

    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    for (const game of games) {
        let contactInfo;
        if (game.player_2_id === null) {
            contactInfo = `AI Difficulty: ${game.AI_difficulty || 'Not specified'}`;
        } else {
            let loserId = (Number(game.winner_id) !== Number(game.player_1_id)) ? game.player_1_id : game.player_2_id;
            const loser = await repositories.player.findById(loserId);
            contactInfo = loser ? loser.email : 'Email not available';
        }

        const winner = await repositories.player.findById(player_id);
        const winnerEmail = winner ? winner.email : 'Email of the winner not available';

        const startTime = new Date(game.start_date);
        const endTime = game.end_date ? new Date(game.end_date) : new Date();
        const timeElapsed = endTime.getTime() - startTime.getTime();
        const hoursElapsed = Math.floor(timeElapsed / (1000 * 60 * 60));
        const minutesElapsed = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
        doc.fontSize(12).text(`Victory for the match: ${game.game_id}`);
        doc.moveDown();

        doc.text(`Number of mouve: ${game.number_of_moves}`);
        doc.text(`Time for win: ${hoursElapsed} houres e ${minutesElapsed} minutes`);
        doc.text(`name of winner: ${winnerEmail}`);
        doc.text(`looser:: ${contactInfo}`);
        doc.moveDown();
    }

    doc.end();

    return new Promise((resolve, reject) => {
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });
        doc.on('error', reject);
    });
}

export async function move(from: string, to: string, playerId: number, gameId: number): Promise<string> {
    const game = await repositories.game.findById(gameId);
    if (!game) {
        throw ErrorFactory.notFound('Game not found');
    }

    if (game.game_status !== Statuses.ACTIVE) {
        throw ErrorFactory.badRequest('Game is finished');
    }

    if (game.player_1_id !== playerId && game.player_2_id !== playerId) {
        throw ErrorFactory.forbidden('You are not part of the game');
    }

    if ((game.player_1_id == playerId && game.game_configuration.turn == "black") || (game.player_2_id == playerId && game.game_configuration.turn == "white")) {
        throw ErrorFactory.forbidden('Not your turn');
    }

    if (!constants.AVAILABLE_LOCATIONS.includes(from) || !constants.AVAILABLE_LOCATIONS.includes(to)) {
        throw ErrorFactory.badRequest('Invalid start or end location');
    }

    const chessGame = new jsChessEngine.Game(game.game_configuration);

    const possibleMoves = chessGame.moves(from);

    if (!possibleMoves.includes(to)) {
        throw ErrorFactory.badRequest('Invalid move. ' + (possibleMoves.length > 0 ? 'Available end locations: ' + possibleMoves.join(', ') : 'No available moves from start position provided.'));
    }

    const move = chessGame.move(from, to);
    if (!move) {
        throw ErrorFactory.internalServerError('Move failed');
    }

    chessGame.printToConsole(); // TODO: Remove this line after testing

    const newConfiguration: JSON = chessGame.exportJson();

    await repositories.move.create({
        player_id: playerId,
        game_id: gameId,
        move_number: game.number_of_moves + 1,
        from_position: from,
        to_position: to,
        configuration_after: newConfiguration,
        is_ai_move: false
    })

    await repositories.game.update(gameId, {
        game_configuration: newConfiguration,
        number_of_moves: game.number_of_moves + 1
    });

    const hasEnoughTokens = await playerService.checkSufficientTokens(player_1_id, constants.GAME_MOVE_COST);
    if (!hasEnoughTokens) {
        throw ErrorFactory.unauthorized('Insufficient tokens');
    }

    await playerService.decrementTokens(playerId, constants.GAME_MOVE_COST);

    let returnString = `You moved from ${from} to ${to}. `;

    if (isGameFinished(newConfiguration)) {
        const winnerId = getWinnerId(newConfiguration, game.player_1_id, game.player_2_id ? game.player_2_id : 0);
        await repositories.game.update(gameId, {
            game_status: Statuses.FINISHED,
            winner_id: winnerId,
            end_date: new Date()
        });
        return returnString + `Game finished. You won!`;
    }

    if (game.AI_difficulty) {
        const aiMove = chessGame.aiMove(game.AI_difficulty);
        if (!aiMove) {
            throw ErrorFactory.internalServerError('AI move failed');
        }

        chessGame.printToConsole(); // TODO: Remove this line after testing

        const newConfiguration: JSON = chessGame.exportJson();

        const [from, to]: [string, string] = Object.entries(aiMove)[0] as [string, string];

        await repositories.move.create({
            game_id: gameId,
            move_number: game.number_of_moves + 1,
            from_position: from,
            to_position: to,
            configuration_after: newConfiguration,
            is_ai_move: true
        })

        await repositories.game.update(gameId, {
            game_configuration: newConfiguration,
            number_of_moves: game.number_of_moves + 1
        });

        await playerService.decrementTokens(playerId, constants.GAME_MOVE_COST);

        returnString += `AI moved from ${from} to ${to}. `;
    }

    if (isGameFinished(newConfiguration)) {
        const winnerId = getWinnerId(newConfiguration, game.player_1_id, game.player_2_id ? game.player_2_id : 0);
        await repositories.game.update(gameId, {
            game_status: Statuses.FINISHED,
            winner_id: winnerId,
            end_date: new Date()
        });
        return returnString + 'Game finished. ' + (game.player_1_id === winnerId ? 'You won!' : 'You lost.');
    } else {
        return returnString;
    }
}

function isGameFinished(gameConfiguration: any) {
    return gameConfiguration.checkMate || gameConfiguration.isFinished;
}

function getWinnerId(gameConfiguration: any, player1Id: number, player2Id: number) {
    // Player 1 is always the creator of the game, so the white. Player 2, instead, is the black. If the game
    // is vs AI, AI is black. (Player2Id, if AI, is 0)
    return gameConfiguration.turn === "white" ? player2Id : player1Id;
    // TODO: assign points to the winner
}