import PDFDocument from 'pdfkit';
import sharp from 'sharp';
import svg2img from 'svg2img';
import {generateChessboardSVG} from '../services/gameService';
import {promisify} from 'util';

const svg2imgAsync = promisify(svg2img);

interface ExportStrategy {
    export(moves: any[]): Promise<any>;
}

class JSONExportStrategy implements ExportStrategy {
    export(moves: any[]): Promise<string> {
        return Promise.resolve(JSON.stringify(moves));
    }
}

class PdfExportStrategy implements ExportStrategy {
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
            doc
                .font('Helvetica')
                .fontSize(12)
                .text(`Player ${move.player_name} moved a ${move.piece} from ${move.from_position} to ${move.to_position}`, { continued: true })
                .text(`Move number: ${move.move_number}`, { align: 'right' })
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