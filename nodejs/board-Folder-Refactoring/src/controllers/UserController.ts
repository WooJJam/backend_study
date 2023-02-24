import express, {Request as req, Request, Response as res, Response} from "express";
import {Service} from 'typedi';
import {Body, Delete, Get, HttpCode, JsonController, Param, Patch, Post, QueryParam, Req, Res, Session, SessionParam, UseBefore} from 'routing-controllers';
import {User} from "../models";

@JsonController('/auth') // /auth/register 에서 auth
@Service() // Container에 담기 위해서 써줘야함

export class UserController{
    constructor() {};
    @HttpCode(200)
    @Post('/register')

    public async register(@Body() user: any, req:Request,res:Response) {
        const email:string = user.email;
        const password:string = user.password;
        const password2:string = user.check_password;
        const name:string = user.name;
        const phone:string = user.phone_number;
        const nickname:string = user.nickname;
    
        if(password === password2) {
            const user = new User({
                email : email,
                password : password,
                name : name,
                phone: phone,
                nickname: nickname
            })
            // user.save();
            return ("회원가입 완료");
        }else {
            return ("실패!");
        }
    }
}