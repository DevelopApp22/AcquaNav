import { model, Schema } from "mongoose";

import { INavigationPlan, StatusNavigation } from "../navigationPlan.interface";

/**
 * Schema `NavigationPlanSchema`
 *
 * Modella un piano di navigazione nel database.
 * Include:
 * - riferimento all'utente (`user`)
 * - codice della barca (`boatId`)
 * - array di waypoint (`waypoints`)
 * - date di inizio/fine navigazione
 * - stato della richiesta (`status`)
 * - motivo di rifiuto opzionale (`rejectionReason`)
 * - data di creazione (`createdAt`)
 */
const NavigationPlanSchema = new Schema<INavigationPlan>({
  userId: {
    type: String,
    ref: 'User',        // riferimento al documento utente
    required: true
  },
  boatId: {
    type: String,
    required: true,
    minlength: 10,      // codice barca di 10 caratteri precisi
    maxlength: 10
  },
  waypoints: {
    type: [
      {
        lon: { type: Number, required: true },
        lat: { type: Number, required: true },
        _id: false, 
      },
    ],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: Schema.Types.String,
    enum:  Object.values(StatusNavigation),
    default: StatusNavigation.PENDING,
    required:true
  },
  rejectionReason: { type: String },  // motivazione visibile solo se rejected
});

/**
 * Indice composito su `user` e `status`
 *
 * Serve per ottimizzare le query che filtrano i piani per utente e stato (es. richieste utente o operatore).
 */
NavigationPlanSchema.index({ user: 1, status: 1 });

/**
 * Esportazione del modello `NavigationPlan`
 *
 * Permette di interagire con la collezione `navigationplans` nel database.
 */
export const NavigationPlan = model<INavigationPlan>('NavigationPlan', NavigationPlanSchema);