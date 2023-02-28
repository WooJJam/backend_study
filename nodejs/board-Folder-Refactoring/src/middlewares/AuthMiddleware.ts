import { Request, Response, NextFunction } from "express"

export const checkLogin = (req:Request, res:Response, next:NextFunction) => {
    if(req.session.email) {
        res.status(401).send({
            message: "Already Loggin in"
        })
    }else {
        next();
    }
}