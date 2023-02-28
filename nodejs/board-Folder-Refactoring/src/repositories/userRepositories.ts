import { Param } from "routing-controllers";
import {Service} from "typedi";
import { CreateUserDto, LoginUserDto } from "../dtos/UserDto";
import { User } from "../models";
import {Request, Response, NextFunction} from "express";

@Service()
export class UserRepository{
    public async create(createUserDto: CreateUserDto) {
        const user = await new User({
            email : createUserDto.email,
            password : createUserDto.password,
            name : createUserDto.name,
            phone: createUserDto.phone,
            nickname: createUserDto.nickname
        })
        // user.save();
        return 'OK';
    }

    public async login(loginUserDto: LoginUserDto) {
            const result = await User.findOne({email:loginUserDto.id, password: loginUserDto.pw}).exec();

            if(result != null) {
                // console.log(result);
                return result;
            } else {
                console.log("존재하지 않는 회원정보 입니다.");
                return 'NOK';
            }
    }
}