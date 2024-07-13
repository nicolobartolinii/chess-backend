import {ErrorFactory} from "../factories/errorFactory";
import {Statuses} from "../utils/statuses";
import {repositories} from "../repositories";
import * as constants from "../utils/constants";
import * as playerService from "./playerService";
import {AiLevel} from "../utils/aiLevels";
import PDFDocument from 'pdfkit';
import {svg2imgAsync} from "../strategies/exportStrategies";
import sharp from 'sharp';
import {Game} from "../models/game";

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
export async function createGame(player_1_id: number, player_2_email?: string, AI_difficulty?: AiLevel): Promise<Game> {
    const hasEnoughTokens = await playerService.checkSufficientTokens(player_1_id, constants.GAME_CREATE_COST);
    if (!hasEnoughTokens) {
        throw ErrorFactory.unauthorized('Insufficient tokens');
    }

    const player1Games = await repositories.game.findByPlayer(player_1_id);

    player1Games.forEach(game => {
        if (game.game_status === Statuses.ACTIVE) {
            throw ErrorFactory.forbidden('Player 1 is already playing a game');
        }
    })

    let player2 = null;
    if (player_2_email) {
        player2 = await repositories.player.findByEmail(player_2_email);
        if (!player2) {
            throw ErrorFactory.notFound('Player 2 not found');
        }

        const player2Games = await repositories.game.findByPlayer(player2.player_id);

        player2Games.forEach(game => {
            if (game.game_status === Statuses.ACTIVE) {
                throw ErrorFactory.forbidden('Player 2 is already playing a game');
            }
        })

        if (player2.player_id === player_1_id) {
            throw ErrorFactory.badRequest('Player 1 and Player 2 cannot be the same');
        }
    }

    const player_2_id = player2 ? player2.player_id : undefined;

    const game = new jsChessEngine.Game();
    const gameConfiguration = game.exportJson();

    const newGame = await repositories.game.create({
        game_status: Statuses.ACTIVE,
        game_configuration: gameConfiguration,
        number_of_moves: 0,
        start_date: new Date(),
        player_1_id,
        player_2_id: player_2_id || null,
        AI_difficulty: AI_difficulty || null
    });

    await playerService.decrementTokens(player_1_id, constants.GAME_CREATE_COST);

    return newGame;
}

/**
 * This function retrieves the game history of a player. It returns the game_status, number_of_moves, start_date and winner_id of each game.
 *
 * @param {number} player_id - The id of the player whose game history is retrieved
 * @param {Date} startDate - The start date of the game history. If not provided, it retrieves the entire game history.
 * @param {order} order - The order of the game history. It can be 'asc' or 'desc'.
 * @returns A promise that resolves to an array of information about each game.
 */
export async function getGamesHistory(player_id: number, startDate: Date, order: string) {
    const filter_field = 'start_date';
    const finishedGames = await repositories.game.findFinishGames();
    const finishedGameId = new Set(finishedGames.map(game => game.game_id));
    const games = await repositories.game.findByPlayer(player_id, filter_field, startDate);
    const filteredGames = games.filter(game => finishedGameId.has(game.game_id));

    // order the games by start date
    filteredGames.sort((a, b) => {
        if (order === 'asc') {
            return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
        } else {
            return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
        }
    });

    return filteredGames.map(game => ({
        game_id: game.game_id,
        game_status: game.game_status,
        number_of_moves: game.number_of_moves,
        start_date: game.start_date,
        winner_id: game.winner_id,
        result: game.winner_id === player_id ? 'You are the winner.' : 'You are the loser.'
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
        game_id: game.game_id,
        status: game.game_status,
        current_configuration: game.game_configuration,
        opponent: game.player_2_id ? (game.player_1_id === playerId ? game.player_2_id : game.player_1_id) : `AI-${game.AI_difficulty}`,
        turn: game.player_1_id === playerId && game.game_configuration.turn === "white" ? "Your turn" : game.player_2_id === playerId && game.game_configuration.turn === "black" ? "Your turn" : "Opponent's turn"
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
export async function getWinCertificate(player_id: number, game_id: number): Promise<Buffer> {
    const game = await repositories.game.findWonGameByIds(player_id, game_id);

    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
    });

    doc
        .font('Times-Bold')
        .fontSize(20)
        .text(`Win certificate for game ${game.game_id}`, {align: 'center'});
    doc.moveDown(1);

    const player1 = await repositories.player.findById(game.player_1_id);
    const player2 = game.player_2_id ? await repositories.player.findById(game.player_2_id) : null;

    const winner = await repositories.player.findById(player_id);
    const loser = game.player_1_id === player_id ? player2 : player1;

    const startTime = new Date(game.start_date);
    const endTime = game.end_date ? new Date(game.end_date) : new Date();
    const timeElapsed = endTime.getTime() - startTime.getTime();
    const hoursElapsed = Math.floor(timeElapsed / (1000 * 60 * 60));
    const minutesElapsed = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));

    doc
        .font('Times-Italic')
        .fontSize(14)
        .text(`${player1!.username} (White) vs ${player2 ? player2.username : `AI [${game.AI_difficulty}]`} (Black)`, {align: 'center'});

    doc.moveDown();

    doc
        .font('Times-Roman')
        .text(`Number of moves: ${game.number_of_moves}`, {continued: true});
    doc
        .text(`  Time elapsed: ${hoursElapsed > 0 ? (hoursElapsed > 1 ? `${hoursElapsed} hours and` : `${hoursElapsed} hour and`) : ``} ${minutesElapsed > 1 ? `${minutesElapsed} minutes` : `${minutesElapsed} minute`}`, {align: 'right'});

    doc.moveDown();

    const winnerPoints = Math.round(winner!.points * 10) / 10.0;

    doc
        .font('Times-Bold')
        .text(`Winner: ${winner!.username} - ${winner!.email} (currently ${winnerPoints} points in total)`, {align: 'center'});

    doc
        .font('Times-Roman')
        .text(`Win by ${game.game_status === Statuses.FINISHED && game.game_configuration.checkMate ? 'checkmate' : 'abandonment'}`, {align: 'center'});

    doc.moveDown();

    const loserPoints = Math.round(loser!.points * 10) / 10.0;

    doc
        .font('Times-Bold')
        .fontSize(12)
        .text(`Loser: ${loser!.username} - ${loser!.email} (currently ${loserPoints} points in total)`, {align: 'center'});

    doc.moveDown(2);

    doc
        .font('Times-BoldItalic')
        .fontSize(16)
        .text('Final game configuration', {align: 'center'});

    doc.moveDown();

    const svgString = generateChessboardSVG(game.game_configuration);

    const pngBuffer = await svg2imgAsync(svgString);

    const resizedPngBuffer = await sharp(pngBuffer)
        .resize(750, 750, {
            kernel: sharp.kernel.lanczos3,
            fit: 'contain',
            background: {r: 255, g: 255, b: 255, alpha: 0}
        })
        .png({quality: 100})
        .toBuffer();

    const x = (doc.page.width - 300) / 2;

    doc.image(resizedPngBuffer, x, doc.y, {
        fit: [300, 300],
        align: 'center',
        valign: 'center'
    });

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

