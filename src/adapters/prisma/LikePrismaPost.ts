import { prisma } from "../../prisma";

export class LikePrismaPost {
	async executeLike(id: number, userID: string) {
		return await prisma.post.update({
			where: {
				id: id,
			},
			data: {
				likes: { increment: 1 },
				userLikes: { connect: { id: userID } },
			},
		});
	}
	async executeDisike(id: number, userID: string) {
		return await prisma.post.update({
			where: {
				id: id,
			},
			data: {
				likes: { decrement: 1 },
				userLikes: { disconnect: { id: userID } },
			},
		});
	}
}
