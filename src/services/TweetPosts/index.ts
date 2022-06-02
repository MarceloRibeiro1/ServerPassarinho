import { Post, UserProfile } from "@prisma/client";
import { CreatePrismaPosts } from "../../adapters/prisma/CreatePosts";
import {
	GetPrismaCommentNumber,
	GetPrismaLikeNumber,
	GetPrismaPost,
	GetPrismaRecentFeedPosts,
	GetPrismaRecentFeedPostsResponse,
} from "../../adapters/prisma/GetPosts";
import { GetPrismaUserProfile } from "../../adapters/prisma/GetPrismaUserProfile";
import { LikePrismaPost } from "../../adapters/prisma/LikePrismaPost";
import {
	postCount,
	TweetPostsModel,
	TweetResponseModel,
} from "../../models/user_models/UserModels";

export class TweetPostsHandler {
	async CreateTweet(post: TweetPostsModel) {
		const createPrismaPost = new CreatePrismaPosts();

		return createPrismaPost.executePost(post);
	}
	async ResponseTweet(post: TweetResponseModel) {
		const createPrismaPost = new CreatePrismaPosts();

		return createPrismaPost.executeResponse(post);
	}

	async GetRecentFeedPosts() {
		const getPrismaRecentFeedPosts = new GetPrismaRecentFeedPosts();

		return getPrismaRecentFeedPosts.execute();
	}

	async GetPostAuthorInfo(post: Post) {
		const getPrismaUserProfile = new GetPrismaUserProfile();

		const count = new GetPrismaCommentNumber();
		const result = (await count.execute(post.id)) as postCount;

		const profile = (await getPrismaUserProfile.executeById(
			post.authorProfile
		)) as UserProfile;

		return {
			id: post.id,
			likes: post.likes,
			comments: result._count.comment,
			content: post.content,
			image: post.image,
			createdAt: post.createdAt,
			responseTo: post.responseTo,
			username: profile.username,
			name: profile.name,
			userPhoto: profile.photo,
		};
	}

	async GetPost(id: number) {
		const getPrismaPost = new GetPrismaPost();
		return await getPrismaPost.execute(id);
	}

	async GetPostLikesNumber(id: number) {
		const getPrismaLikeNumber = new GetPrismaLikeNumber();
		return await getPrismaLikeNumber.execute(id);
	}

	async GetPostResponse(id: number) {
		const getPrismaPostResponse = new GetPrismaRecentFeedPostsResponse();
		return await getPrismaPostResponse.execute(id);
	}

	async PostLike(postId: number, userId: string) {
		const like = new LikePrismaPost();
		return await like.executeLike(postId, userId);
	}

	async PostDisike(postId: number, userId: string) {
		const like = new LikePrismaPost();
		return await like.executeDisike(postId, userId);
	}
}
