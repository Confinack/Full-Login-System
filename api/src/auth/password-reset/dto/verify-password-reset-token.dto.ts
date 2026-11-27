import {
    IsString,
    IsNotEmpty,
    MinLength
} from "class-validator";

export class ResetPasswordDTO {
    /**
     * @example "19193d55-6991-4164-b4d4-e415c49bd330"
    */
    @IsString({message: "The token field has to be a string"})
    @IsNotEmpty({message: "The token field can not be empty"})
    token: string;

    /**
     * @example "senha_nova123456"
    */
    @IsString({message: "The password field has to be a string"})
    @IsNotEmpty({message: "The password field can not be empty"})
    @MinLength(6, {message: "The password min length is 6"})
    password: string;

    /**
     * @example "senha_nova123456"
    */
    @IsString({message: "The confirmPassword field has to be a string"})
    @IsNotEmpty({message: "The confirmPassword field can not be empty"})
    @MinLength(6, {message: "The confirmPassword min length is 6"})
    confirmPassword: string;
}