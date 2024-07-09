import PDFDocument from 'pdfkit';

interface ExportStrategy {
    export(moves: any[]): Promise<any>;
}

class JSONExportStrategy implements ExportStrategy {
    export(moves: any[]): Promise<string> {
        return Promise.resolve(JSON.stringify(moves));
    }
}

class PdfExportStrategy implements ExportStrategy {
    export(moves: any[]): Promise<Buffer> {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {});

        doc.fontSize(12).text('Game moves');
        doc.moveDown();

        moves.forEach(move => { // todo finish implementation when have more seed or finish a completle game
            doc.text(`Move number: ${move.move_number}`);
            doc.text(`Move: ${move.from_position}`);
            doc.text(`To: ${move.to_position}`);
            doc.text(`player id: ${move.player_id}`);

            doc.moveDown();
        });

        doc.end();

        return new Promise((resolve, reject) => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
        });
    }
}

export { JSONExportStrategy, PdfExportStrategy, ExportStrategy };