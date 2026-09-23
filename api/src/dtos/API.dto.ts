export interface UserHandlersResponse<T = any> {
    status: number,
    message?: string,
    body?: T
}