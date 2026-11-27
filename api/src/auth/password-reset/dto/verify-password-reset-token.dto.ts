import {
    IsString,
    IsNotEmpty,
    MinLength
} from "class-validator";

export class ResetPasswordDTO {
    @IsString({message: "The token field has to be a string"})
    @IsNotEmpty({message: "The token field can not be empty"})
    token: string;

    @IsString({message: "The password field has to be a string"})
    @IsNotEmpty({message: "The password field can not be empty"})
    @MinLength(6, {message: "The password min length is 6"})
    password: string;

    @IsString({message: "The confirmPassword field has to be a string"})
    @IsNotEmpty({message: "The confirmPassword field can not be empty"})
    @MinLength(6, {message: "The confirmPassword min length is 6"})
    confirmPassword: string;
}