import {repositories} from "../repositories";
import {ErrorFactory} from "../factories/errorFactory";
import {Statuses} from "../utils/statuses";
import * as playerService from "./playerService";
import * as constants from "../utils/constants";
import {AiLevel, AiLevels} from "../utils/aiLevels";
import {Game} from "../models/game";
import {MoveEffects} from "../utils/moveEffects";

const jsChessEngine = require('js-chess-engine');

/**
 * Verifies if the game is active.
 *
 * @param {Game} game - The game object to verify
 *
 * @throws {ErrorFactory} - Throws an error if the game is not found or is finished
 */
function verifyGameStatus(game: Game) {
    if (game.game_status !== Statuses.ACTIVE) {
        throw ErrorFactory.badRequest('Game is finished');
    }
}

/**
 * Verifies if it's the player's turn.
 *
 * @param {Game} game - The game object
 * @param {number} playerId - The ID of the player
 *
 * @throws {ErrorFactory} - Throws an error if it's not the player's turn
 */
function verifyPlayerTurn(game: Game, playerId: number) {
    if ((game.player_1_id == playerId && game.game_configuration.turn == "black") ||
        (game.player_2_id == playerId && game.game_configuration.turn == "white")) {
        throw ErrorFactory.forbidden('Not your turn');
    }
}

/**
 * Verifies if the move locations are valid.
 *
 * @param {string} from - The starting position
 * @param {string} to - The ending position
 *
 * @throws {ErrorFactory} - Throws an error if the locations are invalid
 */
function verifyMoveLocations(from: string, to: string) {
    if (!constants.AVAILABLE_LOCATIONS.includes(from) || !constants.AVAILABLE_LOCATIONS.includes(to)) {
        throw ErrorFactory.badRequest('Invalid start or end location');
    }
}

/**
 * Executes the player's move and updates the game state.
 *
 * @param {any} chessGame - The chess game object
 * @param {string} from - The starting position
 * @param {string} to - The ending position
 * @param {number} playerId - The ID of the player
 * @param {number} gameId - The ID of the game
 * @param {Game} game - The game object
 *
 * @returns {Promise<{newConfiguration: any, pieceMoved: string}>} - The new game configuration and the piece moved
 *
 * @throws {ErrorFactory} - Throws an error if the move is invalid or fails
 */
async function executePlayerMove(chessGame: any, from: string, to: string, playerId: number, gameId: number, game: Game) {
    const possibleMoves = chessGame.moves(from);
    let pieceKey = chessGame.exportJson().pieces[from] as constants.PieceKey;
    let pieceMoved = constants.PIECES[pieceKey];

    if (!possibleMoves.includes(to)) {
        if (!pieceKey) {
            throw ErrorFactory.badRequest('Invalid move. No piece at start location');
        }
        throw ErrorFactory.badRequest('Invalid move. ' + (possibleMoves.length > 0 ? 'Available end locations: ' + possibleMoves.join(', ') : 'No available moves from start position provided.'));
    }

    const move = chessGame.move(from, to);
    if (!move) {
        throw ErrorFactory.internalServerError('Move failed');
    }

    let newConfiguration = chessGame.exportJson();

    await repositories.move.create({
        player_id: playerId,
        game_id: gameId,
        move_number: game.number_of_moves + 1,
        from_position: from,
        to_position: to,
        configuration_after: newConfiguration,
        piece: pieceMoved
    });

    await repositories.game.update(gameId, {
        game_configuration: newConfiguration,
        number_of_moves: game.number_of_moves + 1
    });

    await playerService.decrementTokens(playerId, constants.GAME_MOVE_COST);

    return {newConfiguration, pieceMoved};
}

/**
 * Executes the AI's move and updates the game state.
 *
 * @param {any} chessGame - The chess game object
 * @param {number} gameId - The ID of the game
 * @param {AiLevel} aiLevel - The AI difficulty level
 * @param {Game} updatedGame - The updated game object
 * @param {number} playerId - The ID of the player
 *
 * @returns {Promise<{from: string, to: string, pieceMoved: string, newConfiguration: any}>} - The AI move details and new game configuration
 *
 * @throws {ErrorFactory} - Throws an error if the AI move fails
 */
async function executeAIMove(chessGame: any, gameId: number, aiLevel: AiLevel, updatedGame: Game, playerId: number) {
    const aiLevelValue = getAiLevelValue(aiLevel);
    const oldConfiguration = JSON.parse(JSON.stringify(chessGame.exportJson()));
    const aiMove = chessGame.aiMove(aiLevelValue);
    if (!aiMove) {
        throw ErrorFactory.internalServerError('AI move failed');
    }

    const [from, to]: [string, string] = Object.entries(aiMove)[0] as [string, string];

    let pieceKey = oldConfiguration.pieces[from] as constants.PieceKey;
    let pieceMoved = constants.PIECES[pieceKey];

    let newConfiguration = chessGame.exportJson();

    await repositories.move.create({
        game_id: gameId,
        move_number: updatedGame.number_of_moves + 1,
        from_position: from,
        to_position: to,
        configuration_after: newConfiguration,
        piece: pieceMoved
    });

    await repositories.game.update(gameId, {
        game_configuration: newConfiguration,
        number_of_moves: updatedGame.number_of_moves + 1
    });

    await playerService.decrementTokens(playerId, constants.GAME_MOVE_COST);

    return {from, to, pieceMoved, newConfiguration};
}

/**
 * Handles the end of a game, updating the game status and determining the winner.
 *
 * @param {any} newConfiguration - The new game configuration
 * @param {Game} game - The game object
 * @param {number} gameId - The ID of the game
 * @param {string} returnString - The current return string
 *
 * @returns {Promise<string>} - A message indicating the game result
 */
async function handleGameFinished(newConfiguration: any, game: Game, gameId: number, returnString: string, playerId: number): Promise<string> {
    const winnerId = isStalemate(newConfiguration) ? null : await winGame(newConfiguration, game.player_1_id, game.player_2_id ? game.player_2_id : 0);
    await repositories.game.update(gameId, {
        game_status: Statuses.FINISHED,
        winner_id: winnerId || null,
        end_date: new Date()
    });
    return returnString + ' Game finished. ' + (isStalemate(newConfiguration) ? 'Stalemate!' : (winnerId === playerId ? 'You won!' : 'You lost.'));
}

/**
 * This function makes a move in a specific game. It checks if the game is active and if it is the player's turn.
 * It checks if the start and end locations are valid and if the move is valid.
 * If the move is valid, it makes the move and updates the game configuration.
 * After the player move, it checks if the game is finished and in case it is, it updates the game status and winner.
 * If the game is vs AI, it makes a move for the AI.
 * After the AI move, it checks if the game is finished and in case it is, it updates the game status and winner.
 *
 * @param {string} from - The start location of the move
 * @param {string} to - The end location of the move
 * @param {number} playerId - The id of the player who makes the move
 * @param {number} gameId - The id of the game where the move is made
 *
 * @returns {Promise<string>} - A promise that resolves to a string with the move information.
 */
export async function move(from: string, to: string, playerId: number): Promise<string> {
    const game = await repositories.game.findActiveGameByPlayer(playerId);
    if (!game) {
        throw ErrorFactory.notFound('No active game found');
    }
    verifyGameStatus(game);
    verifyPlayerTurn(game, playerId);
    verifyMoveLocations(from, to);

    const hasEnoughTokens = await playerService.checkSufficientTokens(playerId, constants.GAME_MOVE_COST);
    if (!hasEnoughTokens) {
        throw ErrorFactory.unauthorized('Insufficient tokens');
    }

    const gameId = game.game_id;

    const chessGame = new jsChessEngine.Game(game.game_configuration);
    const {newConfiguration, pieceMoved} = await executePlayerMove(chessGame, from, to, playerId, gameId, game);

    let returnString = `You moved a ${pieceMoved} from ${from} to ${to}.`;

    if (isGameFinished(newConfiguration)) {
        return handleGameFinished(newConfiguration, game, gameId, returnString, playerId);
    }

    if (game.AI_difficulty) {
        const aiMoveResult = await executeAIMove(chessGame, gameId, game.AI_difficulty as AiLevel, game, playerId);
        returnString += ` AI moved a ${aiMoveResult.pieceMoved} from ${aiMoveResult.from} to ${aiMoveResult.to}.`;

        if (isGameFinished(aiMoveResult.newConfiguration)) {
            return handleGameFinished(aiMoveResult.newConfiguration, game, gameId, returnString, playerId);
        }
    }

    return returnString;
}

/**
 * This function checks if a game is finished.
 *
 * @param {any} gameConfiguration - A JSON object representing the game configuration (provided by the js-chess-engine library)
 *
 * @returns {boolean} - A boolean indicating if the game is finished.
 */
function isGameFinished(gameConfiguration: any) {
    return gameConfiguration.isFinished;
}

/**
 * This function checks if a game is a stalemate.
 *
 * @param {any} gameConfiguration - A JSON object representing the game configuration (provided by the js-chess-engine library)
 *
 * @returns {boolean} - A boolean indicating if the game is a stalemate.
 */
function isStalemate(gameConfiguration: any) {
    return !gameConfiguration.check && !gameConfiguration.checkMate && gameConfiguration.isFinished;
}

/**
 * This function increments the points of the winner of a game.
 * If the winner is the AI, it does not increment the points because the AI is not a player in the database.
 *
 * @param {any} gameConfiguration - A JSON object representing the game configuration (provided by the js-chess-engine library)
 * @param {number} player1Id - The id of the player who created the game
 * @param {number} player2Id - The id of the player who joined the game. If the game is vs AI, it is 0.
 *
 * @returns {Promise<number>} - A promise that resolves to the id of the winner.
 */
async function winGame(gameConfiguration: any, player1Id: number, player2Id: number): Promise<number> {
    // Player 1 is always the creator of the game, so the white. Player 2, instead, is the black. If the game
    // is vs AI, AI is black. (Player2Id, if AI game, is 0)
    const winnerId = gameConfiguration.turn === "white" ? player2Id : player1Id;
    if (winnerId !== 0) {
        await playerService.incrementPoints(winnerId, constants.GAME_WIN_PRIZE);
    }
    return winnerId;
}

/**
 * This function returns the numerical value of the AI level.
 *
 * @param {AiLevel} level - The AI level in string format (using a custom enum)
 *
 * @returns {number} - The numerical value of the AI level to be used in the js-chess-engine library.
 */
function getAiLevelValue(level: AiLevel): number {
    return AiLevels[level];
}

/**
 * This function retrieves all the moves of a specific game.
 * It returns an array of objects with the player name, game id, move number, start and end locations,
 * player id, configuration after the move, piece moved and move effect.
 * The move effect is a string indicating if the move resulted in a check, checkmate or abandonment.
 *
 * @param {number} playerId - The id of the player who requests the moves
 * @param {number} gameId - The id of the game whose moves are retrieved
 *
 * @returns {Promise<{ player_name: string, game_id: number, move_number: number, from_position: string, to_position: string, player_id: number, configuration_after: any, piece: string, moveEffect: string }[]>} - A promise that resolves to an array of information about each move.
 */
export async function getGameMoves(playerId: number, gameId: number) {
    const game = await repositories.game.findById(gameId)
    if (!game) {
        throw ErrorFactory.notFound('Game not found');
    }
    if (game.player_1_id !== playerId && game.player_2_id !== playerId) {
        throw ErrorFactory.forbidden('You are not part of the game');
    }

    if (!game) {
        throw ErrorFactory.notFound('Game not found');
    }

    const moves = await repositories.move.findByGame(gameId);

    const player1 = await repositories.player.findById(game.player_1_id);

    const player2 = game.player_2_id ? await repositories.player.findById(game.player_2_id) : null;

    return moves.map(move => {
        let moveEffect = '';
        if (move.configuration_after.check) {
            moveEffect = MoveEffects.CHECK;
        }
        if (moves[moves.length - 1].move_number === move.move_number && game.game_status === Statuses.FINISHED) {
            if (move.piece === null) {
                moveEffect = MoveEffects.ABANDON;
            }
            if (move.configuration_after.checkMate) {
                moveEffect = MoveEffects.CHECKMATE;
            }
        }
        const player_name = move.player_id === game.player_1_id ? player1?.username : player2?.username;
        let timeElapsed = move.move_number === 1 ? Math.abs(game.createdAt.getTime() - move.createdAt.getTime()) : Math.abs(moves[move.move_number - 2].createdAt.getTime() - move.createdAt.getTime());
        timeElapsed = Math.floor(timeElapsed / 1000);
        const timeElapsedString = timeElapsed > 3600 ? `${Math.floor(timeElapsed / 3600)}h ${Math.floor((timeElapsed % 3600) / 60)}m ${timeElapsed % 60}s` : timeElapsed > 60 ? `${Math.floor(timeElapsed / 60)}m ${timeElapsed % 60}s` : `${timeElapsed}s`;
        return {
            player_name: player_name ? player_name : 'AI',
            game_id: move.game_id,
            move_number: move.move_number,
            from_position: move.from_position,
            to_position: move.to_position,
            player_id: move.player_id,
            configuration_after: move.configuration_after,
            piece: move.piece,
            moveEffect: moveEffect,
            time_elapsed: timeElapsedString
        }
    });
}

/**
 * This function makes a player abandon the currently active game.
 * It checks if it is the player's turn.
 * If the player abandons the game, the game status is updated to finished and the winner is the other player.
 *
 * @param {number} playerId - The id of the player who abandons the game
 * @param {number} gameId - The id of the game that is abandoned
 *
 * @returns {Promise<void>} - A promise that resolves when the game is abandoned.
 */
export async function abandon(playerId: number): Promise<void> {
    const game = await repositories.game.findActiveGameByPlayer(playerId);
    if (!game) {
        throw ErrorFactory.notFound('No active game found');
    }

    if ((game.player_1_id == playerId && game.game_configuration.turn == "black") || (game.player_2_id == playerId && game.game_configuration.turn == "white")) {
        throw ErrorFactory.forbidden('Not your turn');
    }

    const winnerId = game.player_1_id === playerId ? game.player_2_id : game.player_1_id;

    await repositories.game.update(game.game_id, {
        game_status: Statuses.FINISHED,
        number_of_moves: game.number_of_moves + 1,
        winner_id: winnerId,
        end_date: new Date()
    });

    await repositories.move.create({
        player_id: playerId,
        game_id: game.game_id,
        move_number: game.number_of_moves + 1,
        from_position: null,
        to_position: null,
        configuration_after: game.game_configuration,
        piece: null
    });

    if (winnerId) {
        await playerService.incrementPoints(winnerId, constants.GAME_WIN_PRIZE);
    }
    await playerService.incrementPoints(playerId, constants.GAME_ABANDON_PENALTY);
}