import {Service} from 'typedi';
import 'reflect-metadata';
import { Body, Delete, Get, HttpCode, JsonController, Render, Param, Patch, Post, QueryParam, Req, Res, Session, SessionParam, UseBefore} from 'routing-controllers';
import {UserService} from "../service/UserService";
import { CreateUserDto, EmailVerify, LoginUserDto } from '../dtos/UserDto';
import { Request, Response } from 'express';
import { checkLogin } from '../middlewares/AuthMiddleware';
import { before } from 'node:test';
import axios from 'axios';
import mailer from 'nodemailer';

require("dotenv").config();

@JsonController('/auth') // /auth/register 에서 auth
@Service() // Container에 담기 위해서 써줘야함

export class UserController{
    constructor(private userSerivce: UserService) {};

    @HttpCode(200)
    @Get('/')

    public async main(@Req() req:Request) {
        return req.session;
    }

    @HttpCode(200)
    @Post('/register')

    public async createUser(@Body() createUserDto: CreateUserDto) {
        return await this.userSerivce.register(createUserDto);
    }

    @HttpCode(200)
    @Get('/login')
    @Render('login.ejs')
    public async login() {
        return ;
    }

    @HttpCode(200)
    @Post('/login')
    @UseBefore(checkLogin)
    public async loginUser(@Body() loginUserDto: LoginUserDto, @Req() req:Request, res:Response) {
        console.log("controller");

        const result =  await this.userSerivce.login(loginUserDto);
        if(result != 'NOK' && result.email != undefined) {
            req.session.email = result.email;
            return {
                message: 'OK'
            };
        }else {
            console.log(result);
            return {
                message: result
            };
        }
    }

    @HttpCode(200)
    @Get('/logout')
    public async logoutUser(@Req() req:Request) {
        console.log(req.session.email);
        req.session.destroy(function(err:Error) {
            if(err) { throw err }
        })
        return {
            message: "Complete"
        }
    }

    @HttpCode(200)
    @Get('/socialLogin')
    @Render('kakao_login.ejs')
    public async socialLogin() {
        return 
    }

    @HttpCode(200)
    @Get('/kakao/callback')
    public async kakaoLoginUser(@QueryParam ('code') code: string) {
        const kakaoInfo = await this.userSerivce.kakaoLogin(code);
        console.log(kakaoInfo);
        return kakaoInfo;
    }

    @HttpCode(200)
    @Get('/naver/callback')
    public async naverLogin(@QueryParam('code') code: string) {
        const naverInfo = await this.userSerivce.naverLogin(code);
        console.log(naverInfo);
        return naverInfo;
    }

    @HttpCode(200)
    @Post('/sendmail')
    public async emailVerify(@Body()emailVerify: EmailVerify) {
        const verifyNum = Math.floor(Math.random() * 100000).toString().padStart(6,'5');
        const transporter = mailer.createTransport({
            service: 'gmail',
            host: 'smtp.naver.com',
            port: 465,
            auth: {
                user: '',
                pass: ''
            },
        });

        var subject = emailVerify.subject;
        var to = emailVerify.to
        var content = emailVerify.content;

        var mailOptions = {
            from: '',
            to: to,
            subject: subject,
            html : `<h1>${verifyNum}</h1>`,

        };

        transporter.sendMail(mailOptions, (err, info) => {
            if(err) console.log(err);
            else {
                console.log('content: '+ info);
            }
        })
        console.log(verifyNum);
        return mailOptions;
    }
}