import "reflect-metadata";
import express from "express";
import "express-session";
import { Container } from "typedi";
// import { User } from "../models";
import DataSource from "./database";
import {User} from '../entities';
import bodyParser from "body-parser";
import {
    useContainer as routingUseContainer,
    useExpressServer,
  } from "routing-controllers";
  import { routingControllerOptions } from "../utils/RoutingConfig";
import express_session from "express-session";
import database from '../loaders/database';


// declare module "express-session" {
//     interface SessionData{
//         userId : String
//     }
// }

declare module 'express-session' {
    interface SessionData {
        email: string,
    }
}

export class App {
    public app:express.Application;

    constructor() {
        this.app = express();
        this.setDatabase();
        this.setMiddlewares();
    }

    private async setDatabase():Promise<void> {
        try{
            await DataSource.initialize().then(()=>console.log('Mysql Connect!')).catch(err=>console.log(err))
        }
        catch(error){
            console.log(error);
        }
    }
    
    private setMiddlewares(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended:false}));
        // this.app.use(express_session({
        //     secret: "secretKey",
        //     resave: false,
        //     saveUninitialized: false,
        //     store:require('mongoose-session')(mongoose),
        // }));
    }

    public async init(port:number): Promise<void> {
        try{
            routingUseContainer(Container);
            useExpressServer(this.app, routingControllerOptions);

            this.app.engine('html', require('ejs').renderFile);
            this.app.set('view engine', 'ejs');

            this.app.listen(port, () =>{
                console.log(`${port} Server Connected..`)
            });
        } catch(err) {
            console.log(err);
        }
    }
}