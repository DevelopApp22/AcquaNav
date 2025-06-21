import mongoose, { Model, Schema } from "mongoose";
import { IUser, UserRole } from "../user.interface";

/**
 * Schema Mongoose `UserSchema`
 *
 * Definisce la struttura del documento MongoDB per la collezione `users`.
 * Ogni utente ha un ruolo e un saldo di token. Sono inclusi anche i timestamp `createdAt` e `updatedAt`.
 */
const UserSchema = new Schema<IUser>({
  email: {
    type: String, // non serve Schema.Types.String
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
    enum: Object.values(UserRole),    // Limitiamo i valori possibili ai tre ruoli previsti
    required: true,                   // Campo obbligatorio per garantire un ruolo valido
    default: UserRole.USER            // Se non specificato, l’utente sarà di tipo standard
  },
  tokens: {
    type: Number,
    default: 0,
    min: 0,
    required: false 
  }
});

/**
 * Modello Mongoose `User`
 *
 * Crea il modello "User" sulla base dello `UserSchema`, che verrà utilizzato
 * per interagire con la collezione `users` all’interno del database.
 */
export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);