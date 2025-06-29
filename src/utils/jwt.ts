import jwt from 'jsonwebtoken';
import { UserPayload } from '../types/user_payload';
import { keyManager } from '../config/keyManager';

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

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";

/**
 * Firma un nuovo JWT con la chiave privata RSA.
 */
export function signJwt(payload: UserPayload): string {
  return jwt.sign(payload, keyManager.privateKey, {
    algorithm: "RS256",
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  
  });
}

/**
 * Verifica un JWT e restituisce il payload se valido.
 */
export function verifyJwt<T>(token: string): T {
  return jwt.verify(token, keyManager.publicKey, {
    algorithms: ["RS256"]
  }) as T;
}
