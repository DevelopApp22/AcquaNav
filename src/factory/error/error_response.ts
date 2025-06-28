/**
 * Interfaccia `ErrorResponseFactory`
 * 
 * Definisce un contratto per la creazione di oggetti di errore standardizzati.
 * Le classi che implementano questa interfaccia sono responsabili di costruire
 * un oggetto contenente:
 * 
 * - `status`: il codice di stato HTTP (es. 400, 404, 500),
 * - `msg`: il messaggio di errore da inviare al client nella risposta.
 * 
 * Questa interfaccia è pensata per essere utilizzata all'interno di factory o handler
 * per errori, garantendo coerenza nella struttura delle risposte di errore restituite
 * dalle API.
 *
 * @method getErrorResponse
 * @returns Un oggetto contenente `status` e `msg`, da utilizzare come corpo della risposta HTTP.
 */

interface ErrorResponse {
    getErrorResponse(): { status: number,  msg: string };
}
