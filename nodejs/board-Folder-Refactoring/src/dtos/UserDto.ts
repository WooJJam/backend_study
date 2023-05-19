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

export class LoginUserDto{
    @IsNotEmpty()
    @IsString()
    public id: string;

    @IsNotEmpty()
    @IsString()
    public pw:string;
}

export class EmailVerify{
    // @IsNotEmpty()
    // @IsString()
    // public email: string;

    @IsNotEmpty()
    @IsString()
    public to: string;

    @IsNotEmpty()
    @IsString()
    public subject: string;

    @IsNotEmpty()
    @IsString()
    public content: string;
}