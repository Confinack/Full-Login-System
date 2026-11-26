export interface IUpdateUser {
    name?: string,
    email?: string,
    password?: string,
    OTP_CODE?: number | null,
    OTP_EXPIRY?: Date | null,
    isVerified?: boolean,
    createdAt?: Date
}