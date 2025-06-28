import app from './app';
import MongoDB from "./db/mongoDb";

// Recupera la porta da variabili d'ambiente, oppure usa 3000 come default
const PORT = process.env.APP_PORT;

/**
 * Funzione asincrona che avvia il server Express dopo essersi connessi a MongoDB.
 * Usa try/catch per gestire errori in fase di connessione o avvio.
 */
async function startServer() {
  try {
    //  Connessione a MongoDB (singleton)
    await MongoDB.getInstance();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Errore nella connessione a MongoDB:", err);
  }
}

// Avvia l'intero processo
startServer();
