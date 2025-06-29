import  { model, Schema } from "mongoose";

import { INavigationPlan } from "../navigationPlan.interface";
import { StatusNavigation } from "../../enum/statusNavigation";

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
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  boatId: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10
  },
  waypoints: {
    type: [
      {
        lon: { type: Number, required: true },
        lat: { type: Number, required: true },
        _id: false
      },
    ],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: Object.values(StatusNavigation),
    default: StatusNavigation.PENDING,
    required: true
  },
  rejectionReason: { type: String }
}, { versionKey: false });


/**
 * Esportazione del modello `NavigationPlan`
 *
 * Permette di interagire con la collezione `navigationplans` nel database.
 */
export const NavigationPlan = model<INavigationPlan>('NavigationPlan', NavigationPlanSchema);