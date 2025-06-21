/**
 * MongoDB - Singleton per la gestione della connessione a MongoDB tramite Mongoose.
 * 
 * Questa classe implementa il pattern Singleton per assicurare che la connessione
 * a MongoDB venga effettuata una sola volta in tutta l'applicazione. Utilizza Mongoose
 * per gestire la connessione e carica le variabili di ambiente da un file `.env`.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

class MongoDB {
  // Istanza statica della classe per implementare il Singleton
  private static instance: MongoDB;

  // Costruttore privato per impedire istanziazione diretta
  private constructor() {}

  /**
   * Restituisce l'unica istanza della classe MongoDB.
   * Se la connessione a MongoDB non è ancora stata effettuata, la esegue.
   * 
   * @returns {Promise<MongoDB>} Istanza della classe MongoDB con connessione attiva
   */
  public static async getInstance(): Promise<MongoDB> {
    if (!MongoDB.instance) {
    const MONGO_URI = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/mydatabase?authSource=admin`;
      try {
        // Effettua la connessione con il database specificato
        await mongoose.connect(MONGO_URI,{
          dbName:process.env.MONGO_DB_NAME
        });
        console.log(" Connessione al DB effettuata");
        
        // Salva l'istanza del singleton dopo la connessione
        MongoDB.instance = new MongoDB();
      } catch (error) {
        console.error("Connessione al DB non riuscita:", error);
        throw error;
      }
    }

    return MongoDB.instance;
  }
}

export default MongoDB;