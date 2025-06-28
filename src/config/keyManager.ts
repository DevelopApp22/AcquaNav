import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";  // Importo solo per il typing di Secret

/**
 * KeyManager centralizzato per la gestione delle chiavi RSA.
 */
class KeyManager {
  public publicKey: jwt.Secret;
  public privateKey: jwt.Secret;

  constructor() {
    
    const basePath = path.join(__dirname, "../../keys");

    // Legge i file e li tipizza direttamente come jwt.Secret
    this.privateKey = fs.readFileSync(path.join(basePath, "private.key"), "utf8") as jwt.Secret;
    this.publicKey = fs.readFileSync(path.join(basePath, "public.key"), "utf8") as jwt.Secret;
  }
}

export const keyManager = new KeyManager();