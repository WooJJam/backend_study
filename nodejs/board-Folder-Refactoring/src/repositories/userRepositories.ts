import {Service} from "typedi";
import { CreateUserDto } from "../dtos/UserDto";
import { User } from "../models";

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
}