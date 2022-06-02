import { prisma } from "../../prisma";

export class GetPrismaUserProfile {
	async executeById(id: string) {
		return await prisma.userProfile.findUnique({
			where: {
				id,
			},
		});
	}
	async executeByUsername(username: string) {
		return await prisma.userProfile.findUnique({
			where: {
				username,
			},
		});
	}
	async executeByAccountId(userId: string) {
		return await prisma.userProfile.findUnique({
			where: {
				userId,
			},
		});
	}

	async getUserLikedPost(userId: string, postId: number) {
		return await prisma.userProfile.findUnique({
			where: {
				id: userId,
			},
			select: {
				likedPosts: {
					where: {
						id: postId,
					},
				},
			},
		});
	}
}
