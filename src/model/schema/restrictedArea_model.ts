import mongoose, { Schema } from "mongoose";
import { IRestrictedArea } from "../restrictedArea.interface";

/**
 * Schema `RestrictedAreaSchema`
 *
 * Definisce la struttura per la rappresentazione di un'area geografica ristretta.
 * Ogni area è identificata da:
 * - un punto `topLeft` (angolo in alto a sinistra) [longitudine, latitudine],
 * - un punto `bottomRight` (angolo in basso a destra) [longitudine, latitudine].
 *
 * La coppia di coordinate è univoca per garantire che non esistano duplicati nel database.
 * Lo schema include timestamp automatici per tracciarne la creazione e l'ultima modifica.
 */

const RestrictedAreaSchema = new Schema<IRestrictedArea>({
    topLeft: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
    bottomRight: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    }
  });

// Indice composito valido (non su array)
RestrictedAreaSchema.index(
  {
    'topLeft.lat': 1,
    'topLeft.lon': 1,
    'bottomRight.lat': 1,
    'bottomRight.lon': 1,
  },
  { unique: true }
);

const RestrictedArea = mongoose.model<IRestrictedArea>('RestrictedArea', RestrictedAreaSchema);
export default RestrictedArea;
