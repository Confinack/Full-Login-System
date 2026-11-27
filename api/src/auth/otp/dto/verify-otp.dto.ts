import {
    IsString,
    IsInt,
    IsNotEmpty
} from "class-validator";

export class VerifyOtpDTO {
    /** 
     * @example "b80d1169-6e57-4f45-9e80-0f348b346c0e"
    */
    @IsString({message: "The user_id field has to be a string"})
    @IsNotEmpty({message: "The user_id field can not be empty"})
    user_id: string;

    /**
     * @example "098212"
    */
    @IsInt({message: "The code field has to be a integer"})
    @IsNotEmpty({message: "The code field can not be empty"})
    code: number;
}