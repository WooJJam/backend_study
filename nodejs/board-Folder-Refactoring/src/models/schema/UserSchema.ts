import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    email: { 
        type: String,
        unique : true
    },
    password: String,
    name: String,
    phone: String,
    nickname: String,
    profile: String
})

export default mongoose.model('User', userSchema);