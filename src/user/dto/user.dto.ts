import { IsEmail, IsNotEmpty, MinLength } from "@nestjs/class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    firstName: string;

    lastName: string;

    @MinLength(6)
    password: string;
}

export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @MinLength(6)
    password: string;
}