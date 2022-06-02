import { prisma } from "../../prisma";

export class GetPrismaUserAccount {
    
    async executeById(id: string){
      return await prisma.userAccount.findUnique({
          where: {
              id,
          }
      });
    }
    async executeByEmail(email: string){
      return await prisma.userAccount.findUnique({
          where: {
              email,
          }
      });
    }
    async executeByUsername(username: string){
      return await prisma.userAccount.findUnique({
          where: {
              username,
          }
      });
    }
}
