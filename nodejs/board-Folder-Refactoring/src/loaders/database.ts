// import mongoose from "mongoose";
// require('dotenv').config();

// export default async function sync():Promise<void> {
//     mongoose.connect(`mongodb+srv://jaemin5548:dnwoals1011@study2.999l4bh.mongodb.net/board?retryWrites=true&w=majority`,)
//     .then(() => console.log('MongoDB connect..'))
//     .catch(err => console.log(err))
// }

import 'reflect-metadata';
import { DataSource} from "typeorm";

export default new DataSource ({
    type:'mysql',
    host:'165.229.86.126',
    port:3306,
    username:'admin',
    password:'!Phantom0308',
    database:'jaemin',
    synchronize: true,
    entities: [__dirname+"/../entities/*.ts"],
})
