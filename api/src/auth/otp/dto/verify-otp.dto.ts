import {
    IsString,
    IsInt,
    IsNotEmpty
} from "class-validator";

export class VerifyOtpDTO {
    @IsString({message: "The user_id field has to be a string"})
    @IsNotEmpty({message: "The user_id field can not be empty"})
    user_id: string;

    @IsInt({message: "The code field has to be a integer"})
    @IsNotEmpty({message: "The code field can not be empty"})
    code: number;
}