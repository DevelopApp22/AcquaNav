import { Request, Response, NextFunction } from "express";
import { RestrictedAreaService } from "../services/restrictedArea_service";
import { StatusCodes } from "http-status-codes";
import { IRestrictedArea } from "../model/restrictedArea.interface";

export class RestrictedAreaController{
    
    constructor(private restrictedAreaService:RestrictedAreaService){}

    createRestrictedArea = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newRestrictedArea:IRestrictedArea= await this.restrictedAreaService.createRestrictedArea(req.body)
            res.status(StatusCodes.CREATED).json(newRestrictedArea);
        } catch (error) {
            next(error);
        }
    };

    getAllRestrictedArea = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const restrictedAreas :IRestrictedArea[] = await this.restrictedAreaService.getAllRestrictedArea()
            res.status(StatusCodes.OK).json(restrictedAreas);
        } catch (error) {
            next(error);
        }
    };

    deleteRestrictedArea = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const restrictedAreaId:string =req.params.id
            await this.restrictedAreaService.deleteRestrictedArea(restrictedAreaId)
            res.status(StatusCodes.OK).json();
        } catch (error) {
            next(error);
        }
    };

    updateRestrictedArea = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const restrictedAreaId :string =req.params.id
            const restrictedArea = await this.restrictedAreaService.updateRestrictedArea(restrictedAreaId,req.body)
            res.status(StatusCodes.OK).json(restrictedArea);
        } catch (error) {
            next(error);
        }
    };
}