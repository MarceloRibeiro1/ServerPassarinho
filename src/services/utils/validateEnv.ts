import { cleanEnv, str } from "envalid";

export function validateEnv(){
    cleanEnv(process.env, {
        JWT_SECRET: str(),
    })
}