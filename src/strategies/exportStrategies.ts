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

        doc.fontSize(14).text('Game moves', { align: 'center' });
        doc.moveDown(2);

        for (const move of moves) {
            doc.fontSize(12).text(`Move number: ${move.move_number}`, { continued: true })
                .text(`   Player ID: ${move.player_id || 'AI'}`, { align: 'right' });
            doc.text(`From: ${move.from_position}  To: ${move.to_position}`);

            const svgString = generateChessboardSVG(move.configuration_after);

            const pngBuffer = await svg2imgAsync(svgString);

            const resizedPngBuffer = await sharp(pngBuffer)
                .resize(250, 250)
                .toBuffer();

            doc.image(resizedPngBuffer, {
                fit: [250, 250],
                align: 'center',
                valign: 'center'
            });

            doc.moveDown(20);
        }

        doc.end();

        return new Promise((resolve, reject) => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
        });
    }
}

export {JSONExportStrategy, PdfExportStrategy, ExportStrategy};