import * as bcrypt from 'bcrypt'
import { GetPrismaUserAccount } from "../../adapters/prisma/GetPrismaUserAccount";
import { AppError } from "../../errors/AppErrors";
import { CreatePrismaUserAccount } from "../../adapters/prisma/CreatePrsmaUserAccount";
import { UserAccountModel } from "../../models/user_models/UserModels";
import jwt from "jsonwebtoken"

export interface TokenData {
    token: string;
    expiresIn: number;
}

export interface DataStoredInToken {
    _id: string;
}

export class AutenticationService{

    async CreateUserAccount({ email, password, username }: UserAccountModel){

        const createPrismaUserAccount = new CreatePrismaUserAccount();

        password = await bcrypt.hash(password, 10);

        await createPrismaUserAccount.execute({ email, password, username })

        const token = this.createToken(email);

        return token;
    }
    async GetAccountByUsername(username: string){

        const getPrismaUserAccountByUsername = new GetPrismaUserAccount();

        return await getPrismaUserAccountByUsername.executeByUsername(username)

    }
    async GetAccountByEmail(email: string){

        const getPrismaUserAccountByEmail = new GetPrismaUserAccount();

        return await getPrismaUserAccountByEmail.executeByEmail(email)
    }
    async Login(email: string, password: string){

        const getPrismaUserAccount = new GetPrismaUserAccount();

        const account = await getPrismaUserAccount.executeByEmail(email);

        if (account){
            const isPasswordMatching = await bcrypt.compare(password, account.password)
            if (isPasswordMatching){

                const token = this.createToken(email)

                return token
            }else throw new AppError("Email or password is incorrect")
        }else throw new AppError("Email or password is incorrect")
        
    }
    private async createToken(email: string){
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET as string;

        const userAccount = await this.GetAccountByEmail(email)

        if (userAccount){
            const dataStoredInToken: DataStoredInToken = {
              _id: userAccount.id,
            };
            return {
              expiresIn,
              token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
            };
        }
    }
    createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
}
