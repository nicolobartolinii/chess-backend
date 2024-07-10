import PDFDocument from 'pdfkit';
import sharp from 'sharp';
import svg2img from 'svg2img';
import {generateChessboardSVG} from '../services/gameService';
import {promisify} from 'util';

const svg2imgAsync = promisify(svg2img);

/**
 * This interface represents the ExportStrategy class.
 */
interface ExportStrategy {
    export(moves: any[]): Promise<any>;
}

/**
 * This class represents the JSONExportStrategy class.
 *
 * JSONExportStrategy is responsible for exporting game moves into a JSON string.
 * It implements the ExportStrategy interface and provides the export method
 * which converts the array of game moves into a JSON formatted string.
 */
class JSONExportStrategy implements ExportStrategy {
    /**
     * Exports the game moves as a JSON string.
     *
     * This method converts the array of moves into a JSON formatted string
     * using the JSON.stringify method.
     *
     * @param {any[]} moves - An array of move objects containing information about each move in the game.
     * @returns {Promise<string>} - A promise that resolves with a string containing the JSON data.
     */
    export(moves: any[]): Promise<string> {
        return Promise.resolve(JSON.stringify(moves));
    }
}

/**
 * This class represents the PdfExportStrategy class.
 *
 * PdfExportStrategy is responsible for exporting game moves into a PDF document.
 * It implements the ExportStrategy interface and provides the export method
 * which processes the game moves, generates a PDF with detailed move information,
 * and embeds images of the game state after each move.
 */
class PdfExportStrategy implements ExportStrategy {
    /**
     * Exports the game moves as a PDF document.
     *
     * This method creates a PDF document using the PDFKit library. It iterates over
     * the array of moves, adding detailed text for each move to the document. If the
     * move indicates a player has abandoned the game, it adds a specific message.
     * Additionally, it generates an image of the game state after each move using
     * the svg2img and sharp libraries to convert SVG to PNG and resize it for the PDF.
     *
     * @param {any[]} moves - An array of move objects containing information about each move in the game.
     * @returns {Promise<Buffer>} - A promise that resolves with a Buffer containing the PDF data.
     */
    async export(moves: any[]): Promise<Buffer> {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {});

        doc
            .font('Helvetica-Bold')
            .fontSize(14)
            .text(`Game ${moves[0].game_id} moves`, { align: 'center' });
        doc.moveDown(2);

        for (const move of moves) { // TODO: manage win and abandon
            if (move.moveEffect !== 'ABANDON') {
                doc
                    .font('Helvetica')
                    .fontSize(12)
                    .text(`Player ${move.player_name} moved a ${move.piece} from ${move.from_position} to ${move.to_position}. ${move.moveEffect}`, {continued: true})
                    .text(`Move number: ${move.move_number}`, {align: 'right'})
            } else {
                doc
                    .font('Helvetica')
                    .fontSize(12)
                    .text(`Player ${move.player_name} abandoned the game.`, {continued: true})
                    .text(`Move number: ${move.move_number}`, {align: 'right'})
            }
            doc
                .fontSize(12)
                .text(`   Player ID: ${move.player_id || 'AI'}`, { align: 'right' })

            const svgString = generateChessboardSVG(move.configuration_after);

            const pngBuffer = await svg2imgAsync(svgString);

            const resizedPngBuffer = await sharp(pngBuffer)
                .resize(750, 750, {
                    kernel: sharp.kernel.lanczos3, // Increases image quality, I think
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .png({ quality: 100 })
                .toBuffer();

            doc.image(resizedPngBuffer, {
                fit: [250, 250],
                align: 'center',
                valign: 'center'
            });

            doc.moveDown(25);
        }

        doc.end();

        return new Promise((resolve, reject) => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
        });
    }
}

export {JSONExportStrategy, PdfExportStrategy, ExportStrategy};