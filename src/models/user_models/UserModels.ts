import { Post } from "@prisma/client";
import { TokenData } from "../../services/auth/auth";

export interface UserAccountModel {
	email: string;
	password: string;
	username: string;
}

export interface UserProfileModel {
	username: string;
	name: string;
	photo: string;
	description: string;
}

export interface TweetPostsModel {
	content: string;
	image?: string;
	userId: string;
	username: string;
	responseTo: number | null;
}
export interface TweetResponseModel {
	content: string;
	image?: string;
	userId: string;
	username: string;
	responseTo: number;
}

export interface TweetPostInfo {
	id: number;
	likes: number;
	content: string;
	comments: number;
	image: string | null;
	createdAt: Date;
	responseTo: number | null;
	username: string;
	name: string;
	userPhoto: string;
}

export interface RequestUser {
	username: string;
	email: string;
	userProfileId: string;
	auth_token: TokenData;
	loggedIn: boolean;
}

export interface likedPostsObjetct {
	likedPosts: Post[];
}

export interface likesCount {
	_count: {
		userLikes: number;
	};
}

export interface postCount {
	_count: {
		comment: number;
	};
}
