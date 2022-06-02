import { RequestUser } from "../models/user_models/UserModels";

declare namespace Express {
	export interface Request {
		user: RequestUser;
	}
}
