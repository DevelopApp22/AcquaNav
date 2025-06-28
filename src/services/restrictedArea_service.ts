import { ErrEnum } from "../factory/error/error_enum";
import { ErrorFactory } from "../factory/error/error_factory";
import { IRestrictedArea } from "../model/restrictedArea.interface";
import { RestrictedAreaRepository } from "../repository/restrictedArea_repository";

/**
 * Classe `RestrictedAreaService`
 * 
 * Gestisce la logica di business relativa alle aree ristrette, validando i dati
 * e delegando le operazioni CRUD al repository sottostante.
 */
export class RestrictedAreaService {

    private errorFactory: ErrorFactory;

    constructor(private restrictedAreaRepository: RestrictedAreaRepository) {
        this.errorFactory = new ErrorFactory();
    }


    /**
     * Crea una nuova area ristretta dopo aver verificato l'unicità dei waypoint.
     * @param restrictedArea Oggetto contenente i dati dell'area.
     * @returns L'area creata.
     * @throws Eccezione se esiste già un'area con gli stessi waypoint.
     */
    async createRestrictedArea(restrictedArea: IRestrictedArea): Promise<IRestrictedArea> {
        const existingArea = await this.restrictedAreaRepository.findAreaByWaypoint(
            restrictedArea.topLeft, 
            restrictedArea.bottomRight
        );
        if (existingArea) {
            throw this.errorFactory.getError(ErrEnum.RestrictedAreaAlreadyExists);
        }
        return await this.restrictedAreaRepository.createArea(restrictedArea);
    }


    /**
     * Aggiorna un'area ristretta esistente.
     * @param areaId Identificativo dell'area da aggiornare.
     * @param updatedData Dati aggiornati.
     * @returns L'area aggiornata.
     * @throws Eccezione se l'area non esiste o se esiste un duplicato sui waypoint.
     */
    async updateRestrictedArea(areaId: string, updatedData: IRestrictedArea): Promise<IRestrictedArea | null> {
        const existingArea = await this.restrictedAreaRepository.findAreaById(areaId);
        if (!existingArea) {
            throw this.errorFactory.getError(ErrEnum.RestrictedAreaNotFound);
        }

        const duplicateArea = await this.restrictedAreaRepository.findAreaByWaypoint(
            updatedData.topLeft, 
            updatedData.bottomRight
        );

        if (duplicateArea) {
            throw this.errorFactory.getError(ErrEnum.RestrictedAreaAlreadyExists);
        }

        const updatedArea = await this.restrictedAreaRepository.updateArea(areaId, updatedData);
        return updatedArea;
    }


    /**
     * Elimina un'area ristretta esistente.
     * @param areaId Identificativo dell'area da eliminare.
     * @throws Eccezione se l'area non esiste.
     */
    async deleteRestrictedArea(areaId: string): Promise<void> {
        const existingArea = await this.restrictedAreaRepository.findAreaById(areaId);
        if (!existingArea) {
            throw this.errorFactory.getError(ErrEnum.RestrictedAreaNotFound);
        }
        await this.restrictedAreaRepository.removeArea(areaId);
    }

    /**
     * Recupera un'area ristretta tramite ID.
     * @param areaId Identificativo dell'area.
     * @returns L'area trovata.
     * @throws Eccezione se l'area non esiste.
     */
    async getRestrictedAreaById(areaId: string): Promise<IRestrictedArea> {
        const area = await this.restrictedAreaRepository.findAreaById(areaId);
        if (!area) {
            throw this.errorFactory.getError(ErrEnum.RestrictedAreaNotFound);
        }
        return area;
    }

    /**
     * Recupera tutte le aree ristrette.
     * @returns Array di aree ristrette.
     * @throws Eccezione se non esistono aree registrate.
     */
    async getAllRestrictedAreas(): Promise<IRestrictedArea[]> {
        const areas = await this.restrictedAreaRepository.listAllAreas();
        if (areas.length === 0) {
            throw this.errorFactory.getError(ErrEnum.NoRestrictedAreasFound);
        }
        return areas;
    }
}
