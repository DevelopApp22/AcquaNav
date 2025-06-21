import { UserRepository } from "../repository/user_repository";
import {ErrorFactory} from "../factory/error/error_factory"
import { ErrEnum } from "../factory/error/error_enum";
import { IUser, UserRole } from "../model/user.interface";

export class UserService {
    constructor(private userRespository: UserRepository) {
    }

    async updateUser(userId:string,item: Partial<IUser>): Promise<IUser | null> {
        const error_factory=new ErrorFactory()
        const user = await this.userRespository.getUserById(userId)
        if(!user ){
           throw error_factory.getError(ErrEnum.UserNotFound)
        }
        if(user.role === UserRole.OPERATOR || user.role === UserRole.ADMIN){
            throw error_factory.getError(ErrEnum.ForbiddenRole)
        }
        const user_token= (user.tokens ?? 0) +(item.tokens??0)
        return await this.userRespository.updateUser(userId,{tokens:user_token}) 
    }


}