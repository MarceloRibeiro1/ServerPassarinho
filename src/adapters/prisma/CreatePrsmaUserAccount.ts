import { prisma } from "../../prisma";
import { UserAccountModel } from "../../models/user_models/UserModels";
import { BaseProfilePhoto } from "../BaseProfilePhoto";

export class CreatePrismaUserAccount {
  async execute({ email, password, username}: UserAccountModel){
    const photo = BaseProfilePhoto

    return await prisma.userAccount.create({
        data:{
            email,
            password,
            username,
            profile: {
              create: {
                username,
                photo,
                name: username
              }
            }
        }
    })
  }
}
