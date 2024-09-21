import dotenv from "dotenv"
import fs from "fs"
dotenv.config()
const config = {
    PORT: process.env.PORT,
    MONGOURL: process.env.MONGOURL,
    JWT_KEY: process.env.JWT_KEY ?? fs.readFileSync("privateKey.key", "utf8"),
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
}
export default config