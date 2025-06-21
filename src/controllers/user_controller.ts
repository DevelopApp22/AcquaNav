import { IUser } from '../model/user.interface';
import { UserService } from '../services/user_service';
import { Request, Response, NextFunction } from "express";

export class UserController {
  constructor(private userService: UserService) {}

  updateUser = async (req: Request, res: Response, next: NextFunction)=>{
    try {
      const userId : string= req.params.id
      const user : IUser|null = await this.userService.updateUser(userId,req.body)
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
  
}