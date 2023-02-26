import {Service} from "typedi";
import { CreateUserDto } from '../dtos/UserDto';
import { UserRepository } from "../repositories/userRepositories";

@Service()

export class UserService{
    constructor(private userRepositoriy: UserRepository){}

        public async register(createUserDto:CreateUserDto) {
            if(createUserDto.password === createUserDto.check_password) {
                return this.userRepositoriy.create(createUserDto);
            }else {
                return ("nok");
            }
        }
}