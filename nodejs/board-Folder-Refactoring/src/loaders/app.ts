import "reflect-metadata";
import express from "express";
import "express-session";
import { Container } from "typedi";
// import { User } from "../models";
import sync from "./database";
import bodyParser from "body-parser";
import {
    useContainer as routingUseContainer,
    useExpressServer,
  } from "routing-controllers";
  import { routingControllerOptions } from "../utils/RoutingConfig";

// declare module "express-session" {
//     interface SessionData{
//         userId : String
//     }
// }

export class App {
    public app:express.Application;

    constructor() {
        this.app = express();
        this.setDatabase();
        this.setMiddlewares();
    }

    public async init(port:number): Promise<void> {
        try{
            routingUseContainer(Container);
            useExpressServer(this.app, routingControllerOptions);

            this.app.listen(port, () =>{
                console.log(`${port} Server Connected..`)
                // const user = new User({
                //     email: "1234@123",
                //     password: "1234",
                //     name: "나 우재민",
                //     phone: "01011",
                //     nickname: "우잼잼잼",
                // })
                // user.save();
            });
        } catch(err) {
            console.log(err);
        }
    }

    private async setDatabase():Promise<void> {
        try {
            sync();
        }catch(err) {
            console.log(err);
        }
    }
    
    private setMiddlewares(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended:false}));
    }
}