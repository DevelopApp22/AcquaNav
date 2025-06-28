/**
 * Enum `ExportFormat`
 *
 * Rappresenta i formati disponibili per l'esportazione dei dati.
 * Può essere utilizzato per specificare il tipo di output richiesto,
 *
 * @enum
 * @property JSON Esportazione in formato JSON (struttura dati leggibile da macchina)
 * @property PDF  Esportazione in formato PDF (documento formattato, leggibile da utenti)
 */
export enum ExportFormat {
  JSON = 'json',
  PDF = 'pdf',
}
