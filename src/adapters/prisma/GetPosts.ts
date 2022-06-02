import { prisma } from "../../prisma";

export class GetPrismaRecentFeedPosts {
	async execute() {
		return await prisma.post.findMany({
			orderBy: {
				createdAt: "desc",
			},
			take: 20,
		});
	}
}
export class GetPrismaRecentFeedPostsResponse {
	async execute(id: number) {
		return await prisma.post.findMany({
			where: {
				responseTo: id,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 20,
		});
	}
}

export class GetPrismaPost {
	async execute(id: number) {
		return await prisma.post.findUnique({
			where: {
				id,
			},
		});
	}
}

export class GetPrismaCommentNumber {
	async execute(id: number) {
		return await prisma.post.findUnique({
			where: {
				id,
			},
			select: {
				_count: {
					select: {
						comment: true,
					},
				},
			},
		});
	}
}

export class GetPrismaLikeNumber {
	async execute(id: number) {
		return await prisma.post.findUnique({
			where: {
				id,
			},
			select: {
				_count: {
					select: {
						userLikes: true,
					},
				},
			},
		});
	}
}
