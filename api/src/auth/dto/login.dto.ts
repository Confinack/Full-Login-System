import {
    IsString,
    IsEmail,
    IsNotEmpty,
    MinLength
} from "class-validator";

export class LoginDTO {
    /** 
     * @example "vitor.emanoel@contratado.com"
    */
    @IsEmail({}, {message: "The email field has to be a valid email"})
    @IsNotEmpty({message: "The email field can not be empty"})
    email: string;

    /** 
     * @example "senha123456"
    */
    @IsString({message: "The password field has to be a string"})
    @IsNotEmpty({message: "The password field can not be empty"})
    @MinLength(6, {message: "The password min length is 6"})
    password: string;
}