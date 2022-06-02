import { NextFunction, Response, Request } from "express";
import * as jwt from "jsonwebtoken";
import { GetPrismaUserAccount } from "../adapters/prisma/GetPrismaUserAccount";
import { AppError } from "../errors/AppErrors";
import { DataStoredInToken } from "../services/auth/auth";

export async function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const cookies = req.body.user.auth_token;
	if (cookies && cookies.token) {
		const secret = process.env.JWT_SECRET as string;
		try {
			const verificationResponse = jwt.verify(
				cookies.token,
				secret
			) as DataStoredInToken;
			const id = verificationResponse._id;
			const getAccount = new GetPrismaUserAccount();
			const user = await getAccount.executeById(id);
			if (user) {
				//req.user = user;
				return next();
			} else {
				return next(new AppError("Error in authentication token", 403));
			}
		} catch (error) {
			return next(new AppError("Error in authentication token", 403));
		}
	} else {
		return next(new AppError("Error in authentication token", 403));
	}
}
