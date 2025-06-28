import { z } from "zod";
import { waypointSchema } from "./navigationPlan.schema";


export const restrictedAreaSchema = z.object({
  topLeft: waypointSchema,
  bottomRight: waypointSchema,
}).refine(data => {
  const { topLeft, bottomRight } = data;
  return (
    topLeft.lat > bottomRight.lat && 
    topLeft.lon < bottomRight.lon    
  );
}, {
  message: 'topLeft deve essere effettivamente in alto a sinistra rispetto a bottomRight',
});