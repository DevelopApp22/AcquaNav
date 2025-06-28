import { ExportFormat } from "../enum/exportFormat";
import { StatusNavigation } from "../enum/statusNavigation";


export interface INavigationPlanQuery {
  status?: StatusNavigation;    // es.: 'pending' | 'approved' | 'rejected' ecc.
  from?: string;      // es.: data in formato ISO (YYYY-MM-DD)
  to?: string;   
  format?: ExportFormat    
  userId?:string;
}