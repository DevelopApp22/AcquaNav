import  { model, Model, Schema } from "mongoose";
import { IUser } from "../user.interface";
import { UserRole } from "../../enum/userRole";

/**
 * Schema Mongoose `UserSchema`
 *
 * Definisce la struttura del documento MongoDB per la collezione `users`.
 * Ogni utente ha un ruolo e un saldo di token
 */

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true,
    default: UserRole.USER
  },
  tokens: {
    type: Number,
    default: 0,
    min: 0,
  }
}, { versionKey: false }); 

// Middleware "pre-save" di Mongoose:
// Questo middleware viene eseguito automaticamente *prima* di ogni operazione di salvataggio (`save()`)
// su un documento basato su questo schema. In pratica intercetta qualsiasi nuova creazione o aggiornamento del documento
// effettuato tramite il metodo `save()`.
UserSchema.pre('save', function (next) {
  // Cast esplicito del contesto `this` come oggetto IUser.
  // In Mongoose, all'interno dei middleware, `this` rappresenta il documento che sta per essere salvato.
  const user = this as IUser;

  // Logica di controllo sul ruolo:
  // Se il ruolo dell'utente non è USER, significa che non deve avere il campo tokens.
  if (user.role !== UserRole.USER) {
    // In questo caso rimuoviamo completamente il campo tokens.
    // Impostare il campo a `undefined` fa sì che Mongoose non lo salvi nel database.
    user.tokens = undefined;
  } 
  // Se invece il ruolo è USER e il campo tokens non è stato valorizzato esplicitamente,
  // allora forziamo l'inizializzazione automatica a 0.
  else if (user.tokens === undefined) {
    user.tokens = 0;
  }
  // Richiama `next()` per proseguire con il flusso di salvataggio.
  next();
});


export const User: Model<IUser> = model<IUser>('User', UserSchema);
