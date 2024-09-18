import dotenv from "dotenv"
import fs from "fs"
dotenv.config()
const config = {
    PORT: process.env.PORT,
    MONGOURL: process.env.MONGOURL,
    JWT_KEY: process.env.JWT_KEY ?? fs.readFileSync("privateKey.key", "utf8")
}
export default config