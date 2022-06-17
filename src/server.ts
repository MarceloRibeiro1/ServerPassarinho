import express, {
	Request,
	Response,
	NextFunction,
	RequestHandler,
} from "express";
import cors from "cors";
import http from "http";
import "express-async-errors";
import { AppError } from "./errors/AppErrors";
import { routes } from "./routes";
import { validateEnv } from "./services/utils/validateEnv";
import { Server } from "socket.io";
import { GetPrismaCommentNumber } from "./adapters/prisma/GetPosts";
var cookieParser = require("cookie-parser");

validateEnv();

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(cookieParser());
app.use(errorMiddleware);

const httpserver = http.createServer(app);

const URL = process.env.BASE_URL;

const io = new Server(httpserver, {
	cors: {
		origin: URL,
	},
});

io.on("connection", (socket) => {
	socket.on("new_post", () => {
		socket.emit("new_tweet");
	});
	socket.on("new_comment", async (data) => {
		socket.emit(`new_comment_${data.responseId}`);
		socket.emit("new_tweet");
	});
});

function errorMiddleware(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			status: "error",
			message: err.message,
		});
	}

	return res.status(500).json({
		status: "error",
		message: `Internal server error - ${err.message}`,
	});
}

httpserver.listen(process.env.PORT || 3333, () => {
	console.log("HTTP server running!");
});
