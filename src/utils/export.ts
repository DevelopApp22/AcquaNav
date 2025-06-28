// utils/exporter.ts
import PDFDocument from 'pdfkit';
import { format } from 'date-fns';
import { Buffer } from 'buffer';
import { INavigationPlan } from '../model/navigationPlan.interface';

// --- Funzione per esportare JSON ---

export function exportToJson(data: INavigationPlan[]): Buffer {
  const jsonString = JSON.stringify(data, null, 2);
  return Buffer.from(jsonString, 'utf-8');
}

// --- Funzione per esportare PDF ---

export async function exportToPdf(data: INavigationPlan[]): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    doc.fontSize(18).text('Esportazione Piani di Navigazione', { underline: true });
    doc.moveDown();

    data.forEach((item, index) => {
      doc.fontSize(14).text(`Piano #${index + 1}`, { underline: true });
      doc.moveDown(0.5);

      doc.fontSize(12).text(`ID: ${item.id}`);
      doc.text(`UtenteID: ${item.userId}`);
      doc.text(`Barca: ${item.boatId}`);
      doc.text(`Stato: ${item.status}`);
      doc.text(`Data inizio: ${formatDate(item.startDate)}`);
      doc.text(`Data fine: ${formatDate(item.endDate)}`);
      doc.moveDown(0.5);
      doc.text('Waypoints:');
      item.waypoints.forEach((wp, i) => {
        doc.text(`  - ${i + 1}) lat: ${wp.lat}, lon: ${wp.lon}`);
      });

      doc.moveDown();
    });

    doc.end();
  });
}

// --- Funzione di formattazione data ---

function formatDate(date: string | Date): string {
  try {
    return format(new Date(date), 'dd/MM/yyyy HH:mm');
  } catch {
    return 'N/A';
  }
}