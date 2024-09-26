import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
   firstName: {
      type: String,
      required: true,
      trim: true
   },
   lastName: {
      type: String,
      required: true,
      trim: true
   },
   mobileNo: {
      type: String,
      required: true,
      trim: true
   },
   email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
   },
   // password: {
   //    type: String,
   //    required: true,
   //    trim: true
   // },
   loginPin: {
      type: String,
      required: true,
      trim: true
   },
   role: {
      type: Number,
      enum: [1, 2, 3],
      default: 1           //1.Users,2.businessOwner,3.admin
   },
   isEmailVerified: {
      type: Number,
      enum: [0, 1],    //0.no,1.yes
      default: 0
   },
   verificationToken: {
      type: String,
      trim: true
   },
   otpExpiration: {
      type: Date,
   },
   otp: {
      type: String,
   },
   isOtpVerified: {
      type: Number,
      enum: [0, 1],    //0.no,1.yes
      default: 0
   },
   locationEnabled: {
      type: Boolean,
      default: false   // If true, location detection is enabled
   },
   location: {
      type: {
         lat: { type: Number },  // Latitude
         lng: { type: Number },  // Longitude
      },
      default: null  // Initially no location is stored
   },
   status: {
      type: Number,
      enum: [0, 1, 2],
      default: 1        //0:delete,1:active,2:inactive
   }
},
   { timestamps: true, versionKey: false }
)
export default mongoose.model("user", userSchema)