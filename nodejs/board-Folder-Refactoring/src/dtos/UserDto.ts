import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto{
    @IsNotEmpty()
    @IsString()
    public email: string;

    @IsNotEmpty()
    @IsString()
    public password:string;

    @IsNotEmpty()
    @IsString()
    public check_password:string;
    
    @IsNotEmpty()
    @IsString()
    public name:string;
    
    @IsNotEmpty()
    @IsString()
    public phone:string;
    
    @IsNotEmpty()
    @IsString()
    public nickname:string;

}