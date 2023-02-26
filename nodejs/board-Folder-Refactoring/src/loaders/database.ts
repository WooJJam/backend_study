import mongoose from "mongoose";
require('dotenv').config();

export default async function sync():Promise<void> {
    mongoose.connect(`mongodb+srv://${process.env.MONGODB_ID}:${process.env.MONGODB_PW}@study2.999l4bh.mongodb.net/board?retryWrites=true&w=majority`,)
    .then(() => console.log('MongoDB connect..'))
    .catch(err => console.log(err))
}