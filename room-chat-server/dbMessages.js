import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    message:String,
    name:String,
    timestamp:String,
    recieved:Boolean
});


export default mongoose.model("messagecontent",MessageSchema);