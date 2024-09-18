import express from "express"
import mongoose from "mongoose"
import config from "./config/config.js"
import user from "./routes/user.js"
import reviews from "./routes/reviews.js"
import bookings from "./routes/booking.js"
import resturants from "./routes/resturants.js"
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
mongoose.connect(config.MONGOURL)
    .then(() => { console.log("MongoDB connected"); })
    .catch((err) => { console.log("MongoDB connection error:", err); });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
user(app)
reviews(app)
bookings(app)
resturants(app)
app.listen(config.PORT, function () { console.log(`port is running on ${config.PORT}`) })