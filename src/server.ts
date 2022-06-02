import express, { Request, Response, NextFunction, RequestHandler } from 'express'
import cors from 'cors';
import 'express-async-errors'
import { AppError } from './errors/AppErrors';
import { routes } from './routes';
import { validateEnv } from './services/utils/validateEnv';
var cookieParser = require('cookie-parser')

validateEnv();

const app = express();
app.use(cors())
app.use(express.json());
app.use(routes)
app.use(cookieParser())
app.use(errorMiddleware)




function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message
        })
    }

    return res.status(500).json({
        status: "error",
        message: `Internal server error - ${err.message}`
    })
}

app.listen(process.env.PORT || 3333, () => {
  console.log('HTTP server running!');
})

