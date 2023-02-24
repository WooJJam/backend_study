import express from "express";
import {Service} from 'typedi';
import {Body, Delete, Get, HttpCode, JsonController, Param, Patch, Post, QueryParam, Req, Res, Session, SessionParam, UseBefore} from 'routing-controllers';
import {User} from "../models";

@JsonController('/auth') // /auth/register 에서 auth
@Service() // Container에 담기 위해서 써줘야함

export class UserController{
    constructor() {};
    @HttpCode(200)
    @Post('/register')

    public async register(req:express.Request,res:express.Response) {
        console.log("!23");
        let email:string = req.body.email;
        var password:string = req.body.password;
        var password2:string = req.body.check_password;
        var name:string = req.body.name;
        var phone:string = req.body.phone_number;
        var nickname:string = req.body.nickname;
    
        if(password === password2) {
            const user = new User({
                email : email,
                password : password,
                name : name,
                phone: phone,
                nickname: nickname
            })
            // user.save();
            res.json("회원가입 완료");
        }else {
            res.json("실패!");
        }
    }
}