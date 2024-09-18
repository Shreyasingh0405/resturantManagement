import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import user from "../models/user.js";
import CONFIG from "../config/config.js";

export const authorized = async (req, res, next) => {
    try {
        const token = req.cookies.userToken;
        if (token == null) {
            return res.status(401).send("Unauthorized Access");
        }
        const signToken = jwt.verify(token, CONFIG.JWT_KEY);
        if (!signToken) {
            return res.status(401).send("Unauthorized Access");
        }
        const checkcreator = await user.findOne({
            email: signToken.email,
            _id: new mongoose.Types.ObjectId(signToken.userId),
        });
        if (!checkcreator || checkcreator.status !== 1) {
            return res.status(401).send("Unauthorized Access");
        } else {
            res.locals.userData = signToken;
            next();
        }
    } catch (error) {
        return res.status(401).send("Unauthorized Access");
    }
};
