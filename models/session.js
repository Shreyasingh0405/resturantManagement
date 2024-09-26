import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"user"
    },
    deviceId: {
        type: String,
        required: true,
        unique: true,
    },
    token: {
        type: String,
        required: true,
    },
    lastActive: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: String,
        enum: ['true', 'false'],
        default: 'true',
    },
},
    { timestamps: true, versionKey: false });
export default mongoose.model('sesion', sessionSchema);
