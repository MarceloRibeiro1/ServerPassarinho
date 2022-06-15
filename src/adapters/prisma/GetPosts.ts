import { prisma } from "../../prisma";

export class GetPrismaRecentFeedPosts {
	async execute(index: number) {
		return await prisma.post.findMany({
			orderBy: {
				createdAt: "desc",
			},
			take: 20,
			skip: index,
		});
	}
}
export class GetPrismaNewestFeedPost {
	async execute() {
		return await prisma.post.findFirst({
			orderBy: {
				createdAt: "desc",
			},
		});
	}
}
export class GetPrismaNewFeedPosts {
	async execute(number: number) {
		return await prisma.post.findMany({
			orderBy: {
				createdAt: "desc",
			},
			take: number,
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
