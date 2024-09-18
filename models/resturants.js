import mongoose from "mongoose"
const objectId=mongoose.Schema.Types.ObjectId
const resturantSchema = new mongoose.Schema({
    resturantName: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: Object,
        required: true,
        trim: true
    },
    contactInfo: {
        type: Object,
        required: true,
        trim: true
    },
    image: {
        type: Array,
        trim: true
    },
    menu: {
        veg: [
            {
                itemName: {
                    type: String,
                    required: true,
                    trim: true
                },
                price:
                {
                    type: Number,
                    required: true,
                    trim: true
                },
                description:
                {
                    type: String,
                    trim: true
                }
            }
        ],
        nonVeg: [
            {
                itemName: {
                    type: String,
                    required: true,
                    trim: true
                },
                price: {
                    type: Number,
                    required: true,
                    trim: true
                },
                description: {
                    type: String,
                    trim: true
                }
            }
        ]
    },
    averagePricePerPerson: {
        type: String,
        trim: true
    },
    ownerId: {
        type: objectId,
        ref: 'user',
        required: true,
        trim: true
    },
    status:{
        type:Number,
        enum:[0,1,2],
        default:1        //0:delete,1:active,2:inactive
     }
},
    { timestamps: true, versionKey: false })
export default mongoose.model("resturant", resturantSchema)