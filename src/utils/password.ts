import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // Numero di cicli di salt per rafforzare la sicurezza dell'hash

/**
 * Funzione `hashPassword`
 *
 * Applica l'hashing a una password in chiaro usando bcrypt.
 * Utilizza un numero predefinito di `SALT_ROUNDS` ciclo in cui l'algoritmo hasha la password
 *
 * @param password La password in chiaro da cifrare
 * @returns La stringa hash generata in modo asincrono
 *
 */
export  async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Funzione `comparePassword`
 *
 * Confronta una password in chiaro con il suo hash salvato.
 * Utilizza la funzione `bcrypt.compare` per verificare la corrispondenza,
 * tenendo conto del salt incluso nell’hash.
 *
 * @param password La password in chiaro fornita dall’utente
 * @param hash L’hash salvato precedentemente (es. dal database)
 * @returns `true` se la password corrisponde all’hash, altrimenti `false`
 *
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}