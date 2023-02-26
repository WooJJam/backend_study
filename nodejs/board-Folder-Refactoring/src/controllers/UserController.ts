import {Service} from 'typedi';
import {Body, Delete, Get, HttpCode, JsonController, Param, Patch, Post, QueryParam, Req, Res, Session, SessionParam, UseBefore} from 'routing-controllers';
import {UserService} from "../service/UserService";
import { CreateUserDto } from '../dtos/UserDto';

@JsonController('/auth') // /auth/register 에서 auth
@Service() // Container에 담기 위해서 써줘야함

export class UserController{
    constructor(private userSerivce: UserService) {};
    @HttpCode(200)
    @Post('/register')

    public async createUser(@Body() createUserDto: CreateUserDto) {
        return await this.userSerivce.register(createUserDto);
    }
}