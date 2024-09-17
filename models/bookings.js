import mongoose from 'mongoose';
const objectId=mongoose.Schema.Types.ObjectId
const bookingSchema = new mongoose.Schema({
  resturantId: {
    type: objectId,
    ref: 'resturant',
    required: true,
    trim:true
  },
  userId: {
    type: objectId,
    ref: 'user',
    required: true,
    trim:true
  },
  numberOfPeople: {
    type: Number,
    required: true,
    trim:true  
  },
  date: {
    type: String,
    required: true ,
    trim:true 
  },
  specialRequests: {
    type: String,
    default: "",
    trim:true  
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  status:{
    type:Number,
    enum:[0,1,2],
    default:1        //0:delete,1:active,2:inactive
 }
},
{timestamps:true,versionKey:false});
export default mongoose.model('booking', bookingSchema);
