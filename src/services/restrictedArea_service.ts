import { ErrEnum } from "../factory/error/error_enum";
import { ErrorFactory } from "../factory/error/error_factory";
import { IRestrictedArea } from "../model/restrictedArea.interface";
import { RestrictedAreaRepository } from "../repository/restrictedArea_repository";

export class RestrictedAreaService{

    constructor(private restrictedAreaRepository: RestrictedAreaRepository){}

    async createRestrictedArea(item:IRestrictedArea):Promise<IRestrictedArea>{
        const errorFactory = new ErrorFactory();

        const restrictedAreaSame= await this.restrictedAreaRepository.findAreaByWaypoint(item.topLeft,item.bottomRight)
        if(restrictedAreaSame){
            throw errorFactory.getError(ErrEnum.RestrictedAreaAlreadyExists)
        }

        const restrictedArea= await this.restrictedAreaRepository.createArea(item)
        return(restrictedArea)

    }

    async updateRestrictedArea(areaId:string,item:IRestrictedArea):Promise<Partial<IRestrictedArea>|null>{
        const errorFactory = new ErrorFactory();
        const restrictedArea = await this.restrictedAreaRepository.findAreaById(areaId)

        if(!restrictedArea){
            throw errorFactory.getError(ErrEnum.RestrictedAreaNotFound)
        }

        const restrictedAreaSame= await this.restrictedAreaRepository.findAreaByWaypoint(item.topLeft,item.bottomRight)
        if(restrictedAreaSame){
            throw errorFactory.getError(ErrEnum.RestrictedAreaAlreadyExists)
        }
        return this.restrictedAreaRepository.updateArea(areaId,item)
    }

    async deleteRestrictedArea(areaId:string){
        const errorFactory = new ErrorFactory();
        const restrictedArea = await this.restrictedAreaRepository.findAreaById(areaId)
        if(!restrictedArea){
            throw errorFactory.getError(ErrEnum.RestrictedAreaNotFound)
        }
        return this.restrictedAreaRepository.removeArea(areaId)
    }

    async getRestrictedAreabyId(areaId:string):Promise<IRestrictedArea|null>{
        const errorFactory = new ErrorFactory();
        const restrictedArea = await this.restrictedAreaRepository.findAreaById(areaId)
        if(!restrictedArea){
            throw errorFactory.getError(ErrEnum.RestrictedAreaNotFound)
        }
        return await this.restrictedAreaRepository.findAreaById(areaId)
    }

    async getAllRestrictedArea():Promise<IRestrictedArea[]>{
        return await this.restrictedAreaRepository.listAllAreas()
    }



}