import jwt from 'jsonwebtoken';
import path from 'path';
import { UserPayload } from '../types/user_payload';
import * as fs from 'fs';

// === Caricamento della chiave privata ===
// La chiave privata RSA è utilizzata per firmare il token in modo asimmetrico.
// Il path viene letto da una variabile d'ambiente (`JWT_PRIVATE_KEY`) per motivi di sicurezza.
// L'encoding 'utf8' garantisce che la chiave venga letta come stringa.
const privateKey = fs.readFileSync(path.resolve(process.env.JWT_PRIVATE_KEY!), 'utf8');

/**
 * Funzione `generateToken`
 *
 * Firma un oggetto payload (contenente dati utente, ruoli, ecc.) creando un JWT
 * usando l’algoritmo asimmetrico `RS256` e una chiave privata.
 *
 * @param payload Oggetto con i dati che verranno codificati nel token (es. id, role)
 * @returns Un token JWT firmato valido per 1 ora
 *
 * @example
 * const token = generateToken({ id: user.id, role: user.role });
 */

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',   // Firma con algoritmo RSA SHA-256
    expiresIn: '1h',      // Token valido per 1 ora
  });
}

