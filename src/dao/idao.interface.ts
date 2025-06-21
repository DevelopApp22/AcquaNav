/**
 * Interfaccia generica per i DAO (Data Access Object), 
 * con metodi asincroni per CRUD su risorse di tipo T.
 */
export interface IDao<T> {
  /**
   * Crea un nuovo elemento.
   * @param item Oggetto da creare
   * @returns L'oggetto creato
   */
  create(item: T): Promise<T>;

  /**
   * Restituisce un elemento dato il suo ID.
   * @param id Identificatore univoco
   * @returns L'oggetto corrispondente, o null se non trovato
   */
  getbyID(id: string): Promise<T | null>;

  /**
   * Restituisce tutti gli elementi.
   * @returns Array di oggetti
   */
  getAll(): Promise<T[]>;

  /**
   * Aggiorna un elemento esistente.
   * @param item Oggetto aggiornato
   * @returns L'oggetto aggiornato
   */
  update(id:string,item :T): Promise<T | null>;

  /**
   * Elimina un elemento.
   * @param item Oggetto da eliminare
   * @returns void
   */
  delete(id: string): Promise<void>;
}
