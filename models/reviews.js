import mongoose from "mongoose"
const objectId = mongoose.Schema.Types.ObjectId
const reviewSchema = new mongoose.Schema({
    resturantId: {
        type: objectId,
        ref: 'resturant',
        required: true,
        trim: true
    },
    userId: {
        type: objectId,
        ref: 'user',
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    response: {
        type: String,
        default: null
    },
    status: {
        type: Number,
        enum: [0, 1, 2],
        default: 1        //0:delete,1:active,2:inactive
    }
},
    { timestamps: true, versionKey: false });

export default mongoose.model('Review', reviewSchema);
