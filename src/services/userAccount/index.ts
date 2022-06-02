import { GetPrismaUserProfile } from "../../adapters/prisma/GetPrismaUserProfile";

export class GetUserProfile {
	async executeById(id: string) {
		const getPrismaUserProfileByUsername = new GetPrismaUserProfile();
		return await getPrismaUserProfileByUsername.executeById(id);
	}
	async executeByUsername(username: string) {
		const getPrismaUserProfileByUsername = new GetPrismaUserProfile();
		return await getPrismaUserProfileByUsername.executeByUsername(username);
	}
	async executeByAccountId(accountId: string) {
		const getPrismaUserProfileByUsername = new GetPrismaUserProfile();
		return await getPrismaUserProfileByUsername.executeByAccountId(accountId);
	}
	async getUserProfileLikes(userId: string, postId: number) {
		const getPrismaUserProfile = new GetPrismaUserProfile();
		return await getPrismaUserProfile.getUserLikedPost(userId, postId);
	}
}
