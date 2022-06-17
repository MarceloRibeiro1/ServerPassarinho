import { Post, UserAccount, UserProfile } from "@prisma/client";
import express, { query } from "express";
import { GetPrismaCommentNumber } from "./adapters/prisma/GetPosts";
import { LikePrismaPost } from "./adapters/prisma/LikePrismaPost";
import { AppError } from "./errors/AppErrors";
import { authMiddleware } from "./middleware/auth.middleware";
import {
	likedPostsObjetct,
	likesCount,
	TweetPostInfo,
} from "./models/user_models/UserModels";
import { AutenticationService, TokenData } from "./services/auth/auth";
import { TweetPostsHandler } from "./services/TweetPosts";
import { GetUserProfile } from "./services/userAccount";

export const routes = express.Router();

// routes.use((req, res, next) => {
//     req.user = 'user'
//     next()
// })

routes.get("/request-email", async (req, res) => {
	const { email } = req.query;

	const autenticationService = new AutenticationService();

	const getResult = await autenticationService.GetAccountByEmail(
		email as string
	);

	if (getResult === null) return res.status(201).send(getResult);
	else throw new AppError("Email already exists");
});

routes.get("/request-username", async (req, res) => {
	const { username } = req.query;

	const autenticationService = new AutenticationService();

	const getResult = await autenticationService.GetAccountByUsername(
		username as string
	);

	if (getResult === null) return res.status(201).send(getResult);
	else throw new AppError("Username already exists");
});

routes.post("/create", async (req, res) => {
	const { email, password, username } = req.body;

	const autenticationService = new AutenticationService();

	const newUserToken = (await autenticationService.CreateUserAccount({
		email,
		password,
		username,
	})) as TokenData;

	const userAccount = (await autenticationService.GetAccountByEmail(
		email
	)) as UserAccount;

	const getUserProfile = new GetUserProfile();

	const userProfile = (await getUserProfile.executeByAccountId(
		userAccount.id
	)) as UserProfile;

	res.setHeader("Set-Cookie", autenticationService.createCookie(newUserToken));
	return res.status(201).send({
		success: true,
		redirectURL: "/home",
		cookie: newUserToken,
		userAccountId: userAccount.id,
		userProfileId: userProfile.id,
		username,
	});
});

routes.post("/login", async (req, res) => {
	const { email, password } = req.body;

	const autenticationService = new AutenticationService();

	const userToken = (await autenticationService.Login(
		email,
		password
	)) as TokenData;

	const userAccount = (await autenticationService.GetAccountByEmail(
		email
	)) as UserAccount;

	const getUserProfile = new GetUserProfile();

	const userProfile = (await getUserProfile.executeByAccountId(
		userAccount.id
	)) as UserProfile;

	res.setHeader("Set-Cookie", [autenticationService.createCookie(userToken)]);
	return res.status(201).send({
		success: true,
		redirectURL: "/home",
		cookie: userToken,
		userAccountId: userAccount.id,
		userProfileId: userProfile.id,
		username: userAccount.username,
		userPhoto: userProfile.photo,
	});
});

routes.post("/logout", async (req, res) => {
	res.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]).status(200).send();
});

routes.post("/tweetresponse", authMiddleware, async (req, res) => {
	const { userId, username } = req.body.user;
	const { content, image, responseTo } = req.body;

	const createPosts = new TweetPostsHandler();

	createPosts.ResponseTweet({
		content,
		image,
		userId,
		username,
		responseTo,
	});

	res.status(200).send();
});

routes.post("/tweet", authMiddleware, async (req, res) => {
	const { userId, username } = req.body.user;
	const { content, image, responseTo } = req.body;

	const createPosts = new TweetPostsHandler();

	createPosts.CreateTweet({
		content,
		image,
		userId,
		username,
		responseTo,
	});

	res.status(200).send();
});

routes.get("/feed", async (req, res) => {
	const recentFeed = new TweetPostsHandler();
	const tweetIndex = parseInt(req.query.tweetIndex as string);

	const feedRecentPosts = await recentFeed.GetRecentFeedPosts(tweetIndex);

	const feedRecentPostsList: TweetPostInfo[] = await Promise.all(
		feedRecentPosts.map(async (tweet) => {
			const getTweet = await recentFeed.GetPostAuthorInfo(tweet);
			return getTweet;
		})
	);

	res.status(200).send({ recentPosts: feedRecentPostsList });
});
routes.get("/feednew", async (req, res) => {
	const recentFeed = new TweetPostsHandler();
	const tweetIndex = parseInt(req.query.tweetIndex as string);

	const latest = (await recentFeed.GetNewestFeedPost()) as Post;
	const feedRecentPosts = await recentFeed.GetNewFeedPosts(
		latest.id - tweetIndex
	);

	const feedRecentPostsList: TweetPostInfo[] = await Promise.all(
		feedRecentPosts.map(async (tweet) => {
			const getTweet = await recentFeed.GetPostAuthorInfo(tweet);
			return getTweet;
		})
	);

	res.status(200).send({ recentPosts: feedRecentPostsList });
});

routes.get("/getlike", async (req, res) => {
	if (Array.isArray(req.query.id)) {
		const userId = req.query.id[0] as string;
		const postId = parseInt(req.query.id[1] as string);
		const getUser = new GetUserProfile();
		const tweet = new TweetPostsHandler();

		const likesNumber = (await tweet.GetPostLikesNumber(postId)) as likesCount;
		const likes = likesNumber._count.userLikes;
		const result: likedPostsObjetct = (await getUser.getUserProfileLikes(
			userId,
			postId
		)) as likedPostsObjetct;
		if (result.likedPosts.length)
			return res.status(200).send({ liked: true, likes });
		res.status(200).send({ liked: false, likes });
	} else {
		throw new AppError("Faild to get likes");
	}
});

routes.post("/like", authMiddleware, async (req, res) => {
	const likePost = new TweetPostsHandler();

	const result = await likePost.PostLike(req.body.postId, req.body.user.userId);

	res.status(200).send(result);
});

routes.post("/dislike", authMiddleware, async (req, res) => {
	const dkislikePost = new TweetPostsHandler();

	const result = await dkislikePost.PostDisike(
		req.body.postId,
		req.body.user.userId
	);

	res.status(200).send(result);
});

routes.get("/tweetdialog", async (req, res) => {
	const tweetDialog = new TweetPostsHandler();
	const postInfo = await tweetDialog.GetPost(
		parseInt(req.query.postId as string)
	);

	const post = await tweetDialog.GetPostAuthorInfo(postInfo as Post);

	const responseRecentPosts = await tweetDialog.GetPostResponse(
		parseInt(req.query.postId as string)
	);

	const responseRecentPostsList: TweetPostInfo[] = await Promise.all(
		responseRecentPosts.map(async (tweet) => {
			const getTweet = await tweetDialog.GetPostAuthorInfo(tweet);
			return getTweet;
		})
	);

	res.status(200).send({ post, responseRecentPostsList });
});

routes.get("/commentnumber", async (req, res) => {
	const count = new GetPrismaCommentNumber();
	const result = await count.execute(parseInt(req.query.id as string));
	res.status(200).send(result);
});
