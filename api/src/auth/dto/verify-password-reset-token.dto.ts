export interface IResetPassword {
    user_id: string,
    token: string,
    password?: string,
    confirmPassword?: string
}