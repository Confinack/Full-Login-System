import {
    IsEmail,
    IsNotEmpty
} from "class-validator";

export class ForgotPasswordDTO {
    /** 
     * @example "vitor.emanoel@contratado.com"
    */
    @IsEmail({}, {message: "The email field has to be a valid email"})
    @IsNotEmpty({message: "The email field can not be empty"})
    email: string;
}