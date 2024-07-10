import {ErrorFactory} from "../factories/errorFactory";
import {Statuses} from "../utils/statuses";
import {repositories} from "../repositories";
import * as constants from "../utils/constants";
import * as playerService from "./playerService";
import {AiLevel, AiLevels} from "../utils/aiLevels";
import PDFDocument from 'pdfkit';

const jsChessEngine = require('js-chess-engine')

/**
 * This function creates a new game. It checks if the player has enough tokens to create a game.
 * If the player has enough tokens, it creates a new game with the provided player_1_id, player_2_email or AI_difficulty.
 *
 * If the player_2_email is provided, it checks if the player_2_email exists in the database.
 * If the player_2_email exists, it creates a new game with the provided player_1_id and player_2_id.
 * If the player_2_email does not exist, it throws an error.
 *
 * If the player_2_email is not provided, it creates a new game with the provided player_1_id and AI_difficulty.
 *
 *
 * @param {number} player_1_id - The id of the player who creates the game
 * @param {string} player_2_email - The email of the player who joins the game. If not provided, the game is vs AI.
 * @param {AiLevel} AI_difficulty - The difficulty of the AI. If not provided, the game is vs AI.
 *
 * @returns {Promise<void>} - A promise that resolves when the game is created.
 */
export async function createGame(player_1_id: number, player_2_email?: string, AI_difficulty?: AiLevel): Promise<void> {
    const hasEnoughTokens = await playerService.checkSufficientTokens(player_1_id, constants.GAME_CREATE_COST);
    if (!hasEnoughTokens) {
        throw ErrorFactory.unauthorized('Insufficient tokens');
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
        AI_difficulty: AI_difficulty || null
    });

    await playerService.decrementTokens(player_1_id, constants.GAME_CREATE_COST);
}

/**
 * This function retrieves the game history of a player. It returns the game_status, number_of_moves, start_date and winner_id of each game.
 *
 * @param {number} player_id - The id of the player whose game history is retrieved
 * @param {Date} startDate - The start date of the game history. If not provided, it retrieves the entire game history.
 *
 * @returns A promise that resolves to an array of information about each game.
 */
export async function getGamesHistory(player_id: number, startDate?: Date) {
    const filter_field = 'start_date';
    const games = await repositories.game.findByPlayer(player_id, filter_field, startDate);
    return games.map(game => ({
        game_status: game.game_status,
        number_of_moves: game.number_of_moves,
        start_date: game.start_date,
        winner_id: game.winner_id
    }));
}

/**
 * This function retrieves the game status of a player in a specific game.
 * It returns the game_status, current_configuration, opponent and turn of the game.
 *
 * @param {number} playerId - The id of the player whose game status is retrieved
 * @param {number} gameId - The id of the game whose status is retrieved
 *
 * @returns A promise that resolves to the game status.
 */
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

/**
 * This function retrieves the win certificate of a player in a specific game.
 * It returns a PDF document with the number of moves, time elapsed, name of the winner and loser of the game.
 *
 * @param {number} player_id - The id of the player whose win certificate is retrieved
 * @param {number} game_id - The id of the game whose win certificate is retrieved
 *
 * @returns {Promise<Buffer>} - A promise that resolves to the win certificate.
 */
export async function getWinCertificate(player_id: number, game_id: number): Promise<Buffer> { // TODO: Improve PDF aesthetics
    const games = await repositories.game.findWonGameByIds(player_id, game_id);

    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
    });

    for (const game of games) {
        let contactInfo;
        if (game.player_2_id === null) {
            contactInfo = `AI Difficulty: ${game.AI_difficulty || 'Not specified'}`;
        } else {
            let loserId = (Number(game.winner_id) !== Number(game.player_1_id)) ? game.player_1_id : game.player_2_id;
            const loser = await repositories.player.findById(loserId);
            contactInfo = loser ? loser.username : 'Username not available';
        }

        const winner = await repositories.player.findById(player_id);
        const winnerEmail = winner ? winner.username : 'Username of the winner not available';

        const startTime = new Date(game.start_date);
        const endTime = game.end_date ? new Date(game.end_date) : new Date();
        const timeElapsed = endTime.getTime() - startTime.getTime();
        const hoursElapsed = Math.floor(timeElapsed / (1000 * 60 * 60));
        const minutesElapsed = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
        doc.fontSize(12).text(`Victory for the match: ${game.game_id}`);
        doc.moveDown();

        doc.text(`Number of moves: ${game.number_of_moves}`);
        doc.text(`Time elapsed: ${hoursElapsed} hours e ${minutesElapsed} minutes`);
        doc.text(`Name of winner: ${winnerEmail}`);
        doc.text(`Loser: ${contactInfo}`);
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

    let pieceMoved: string;
    let pieceKey = chessGame.exportJson().pieces[from] as constants.PieceKey;
    if (pieceKey in constants.PIECES) {
        pieceMoved = constants.PIECES[pieceKey];
    } else {
        throw ErrorFactory.internalServerError('Invalid piece key');
    }

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
    })

    const [, [updatedGame]] = await repositories.game.update(gameId, {
        game_configuration: newConfiguration,
        number_of_moves: game.number_of_moves + 1
    });

    const hasEnoughTokens = await playerService.checkSufficientTokens(playerId, constants.GAME_MOVE_COST);
    if (!hasEnoughTokens) {
        throw ErrorFactory.unauthorized('Insufficient tokens');
    }

    await playerService.decrementTokens(playerId, constants.GAME_MOVE_COST);

    let returnString = `You moved a ${pieceMoved} from ${from} to ${to}. `;

    if (isGameFinished(newConfiguration)) {
        const winnerId = isStalemate(newConfiguration) ? null : await winGame(newConfiguration, game.player_1_id, game.player_2_id ? game.player_2_id : 0)
        await repositories.game.update(gameId, {
            game_status: Statuses.FINISHED,
            winner_id: winnerId || null,
            end_date: new Date()
        });
        return returnString + 'Game finished. ' + (isStalemate(newConfiguration) ? 'Stalemate!' : 'You won!');
    }

    if (game.AI_difficulty) {
        const aiLevel = getAiLevelValue(game.AI_difficulty as AiLevel);
        const oldConfiguration = JSON.parse(JSON.stringify(newConfiguration));
        const aiMove = chessGame.aiMove(aiLevel);
        if (!aiMove) {
            throw ErrorFactory.internalServerError('AI move failed');
        }

        const [from, to]: [string, string] = Object.entries(aiMove)[0] as [string, string];

        pieceKey = oldConfiguration.pieces[from] as constants.PieceKey;
        if (pieceKey in constants.PIECES) {
            pieceMoved = constants.PIECES[pieceKey];
        } else {
            throw ErrorFactory.internalServerError('Invalid piece key');
        }

        newConfiguration = chessGame.exportJson();

        await repositories.move.create({
            game_id: gameId,
            move_number: updatedGame.number_of_moves + 1,
            from_position: from,
            to_position: to,
            configuration_after: newConfiguration,
            piece: pieceMoved
        })

        await repositories.game.update(gameId, {
            game_configuration: newConfiguration,
            number_of_moves: updatedGame.number_of_moves + 1
        });

        await playerService.decrementTokens(playerId, constants.GAME_MOVE_COST);

        returnString += `AI moved a ${pieceMoved} from ${from} to ${to}. `;
    }

    if (isGameFinished(newConfiguration)) {
        const winnerId = isStalemate(newConfiguration) ? null : await winGame(newConfiguration, game.player_1_id, game.player_2_id ? game.player_2_id : 0)
        await repositories.game.update(gameId, {
            game_status: Statuses.FINISHED,
            winner_id: winnerId || null,
            end_date: new Date()
        });
        return returnString + 'Game finished. ' + (isStalemate(newConfiguration) ? 'Stalemate!' : (game.player_1_id === winnerId ? 'You won!' : 'You lost.'));
    } else {
        return returnString;
    }
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
    return !gameConfiguration.check && !gameConfiguration.checkMate;
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
 * This function retrieves the SVG string of the chessboard of a specific game.
 * Specifically, it uses the generateChessboardSVG function to generate the SVG string for the specific game configuration.
 *
 * @param {number} playerId - The id of the player who requests the chessboard
 * @param {number} gameId - The id of the game whose chessboard is retrieved
 *
 * @returns {Promise<string>} - A promise that resolves to the SVG string of the chessboard.
 */
export async function getChessboard(playerId: number, gameId: number): Promise<string> {
    const game = await repositories.game.findById(gameId);
    if (!game) {
        throw ErrorFactory.notFound('Game not found');
    }

    if (game.player_1_id !== playerId && game.player_2_id !== playerId) {
        throw ErrorFactory.forbidden('You are not part of the game');
    }

    const configuration = game.game_configuration;
    return generateChessboardSVG({pieces: configuration.pieces});
}

/**
 * This function generates the SVG string of a chessboard based on a specific configuration.
 * The configuration is provided as a JSON object with the pieces and their positions.
 * The SVG string is generated by creating the board, the pieces and the labels of the chessboard.
 *
 * @param {any} configuration - A JSON object representing the game configuration (provided by the js-chess-engine library)
 *
 * @returns {string} - The SVG string of the chessboard.
 */
export function generateChessboardSVG(configuration: { pieces: Record<string, string> }): string {
    const squareSize = 50;
    const labelSize = 20;
    const boardSize = 8 * squareSize;
    const totalSize = boardSize + labelSize;
    const pieceSize = squareSize * 0.8;

    let svg = `<svg width="${totalSize}" height="${totalSize}" xmlns="http://www.w3.org/2000/svg">`;

    svg += `<rect x="0" y="0" width="${totalSize}" height="${totalSize}" fill="#f0d9b5" />`;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const x = col * squareSize + labelSize;
            const y = row * squareSize;
            const fill = (row + col) % 2 === 0 ? '#ffce9e' : '#d18b47';
            svg += `<rect x="${x}" y="${y}" width="${squareSize}" height="${squareSize}" fill="${fill}" />`;
        }
    }

    for (let row = 0; row < 8; row++) {
        const y = row * squareSize + squareSize / 2;
        svg += `<text x="${labelSize / 2}" y="${y}" font-size="14" text-anchor="middle" dominant-baseline="central" fill="black">
            ${8 - row}
        </text>`;
    }

    for (let col = 0; col < 8; col++) {
        const x = col * squareSize + labelSize + squareSize / 2;
        svg += `<text x="${x}" y="${boardSize + labelSize / 2}" font-size="14" text-anchor="middle" dominant-baseline="central" fill="black">
            ${String.fromCharCode(65 + col)}
        </text>`;
    }

    const pieceSymbols: Record<string, string> = {
        'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
        'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
    };

    for (const [position, piece] of Object.entries(configuration.pieces)) {
        const col = position.charCodeAt(0) - 'A'.charCodeAt(0);
        const row = 8 - parseInt(position[1]);
        const x = col * squareSize + labelSize + squareSize / 2;
        const y = row * squareSize + squareSize / 2;
        const color = piece.toUpperCase() === piece ? 'white' : 'black';

        svg += `
        <g transform="translate(${x},${y})">
            <circle r="${pieceSize / 2}" fill="transparent" />
            <text font-size="${pieceSize}" text-anchor="middle" dominant-baseline="central" fill="${color}">
                ${pieceSymbols[piece]}
            </text>
        </g>`;
    }

    svg += '</svg>';
    return svg;
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
            moveEffect = 'Check';
        }
        if (moves[moves.length - 1].move_number === move.move_number && game.game_status === Statuses.FINISHED) {
            if (move.piece === null) {
                moveEffect = 'ABANDON';
            }
            if (move.configuration_after.checkMate) {
                moveEffect = 'Checkmate';
            }
        }
        const player_name = move.player_id === game.player_1_id ? player1?.username : player2?.username;
        return {
            player_name: player_name ? player_name : 'AI',
            game_id: move.game_id,
            move_number: move.move_number,
            from_position: move.from_position,
            to_position: move.to_position,
            player_id: move.player_id,
            configuration_after: move.configuration_after,
            piece: move.piece,
            moveEffect: moveEffect
        }
    });
}

/**
 * This function makes a player abandon a specific game.
 * It checks if the game is active and if it is the player's turn.
 * If the player abandons the game, the game status is updated to finished and the winner is the other player.
 *
 * @param {number} playerId - The id of the player who abandons the game
 * @param {number} gameId - The id of the game that is abandoned
 *
 * @returns {Promise<void>} - A promise that resolves when the game is abandoned.
 */
export async function abandon(playerId: number, gameId: number): Promise<void> {
    const game = await repositories.game.findById(gameId);
    if (!game) {
        throw ErrorFactory.notFound('Game not found');
    }

    if (game.player_1_id !== playerId && game.player_2_id !== playerId) {
        throw ErrorFactory.forbidden('You are not part of the game');
    }

    if (game.game_status !== Statuses.ACTIVE) {
        throw ErrorFactory.badRequest('Game is already finished');
    }

    if ((game.player_1_id == playerId && game.game_configuration.turn == "black") || (game.player_2_id == playerId && game.game_configuration.turn == "white")) {
        throw ErrorFactory.forbidden('Not your turn');
    }

    const winnerId = game.player_1_id === playerId ? game.player_2_id : game.player_1_id;

    await repositories.game.update(gameId, {
        game_status: Statuses.FINISHED,
        number_of_moves: game.number_of_moves + 1,
        winner_id: winnerId,
        end_date: new Date()
    });

    await repositories.move.create({
        player_id: playerId,
        game_id: gameId,
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