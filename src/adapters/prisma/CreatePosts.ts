import {
	TweetPostsModel,
	TweetResponseModel,
} from "../../models/user_models/UserModels";
import { prisma } from "../../prisma";

export class CreatePrismaPosts {
	async executePost(post: TweetPostsModel) {
		const { content, image, userId, responseTo } = post;

		return await prisma.post.create({
			data: {
				content,
				image,
				authorProfile: userId,
				responseTo,
			},
		});
	}

	async executeResponse(post: TweetResponseModel) {
		const { content, image, userId, responseTo } = post;

		return await prisma.post.create({
			data: {
				content,
				image,
				authorProfile: userId,
				responseTo,
			},
		});
	}
}
