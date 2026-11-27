import {
    IsEmail,
    IsNotEmpty
} from "class-validator";

export class ForgotPasswordDTO {
    @IsEmail({}, {message: "The email field has to be a valid email"})
    @IsNotEmpty({message: "The email field can not be empty"})
    email: string;
}