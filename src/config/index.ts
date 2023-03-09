import "dotenv/config";
export const port = Number(process.env.PORT);
export const connectionDB = String(process.env.DATABASE_URL);
export const email = String(process.env.EMAIL);
export const password = String(process.env.PASSWORD);
export const host = String(process.env.HOST);
export const accessSecret = String(process.env.ACCESS_SECRET);
export { default as Admin } from "./firebase";
