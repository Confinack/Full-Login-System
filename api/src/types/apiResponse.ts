export interface IApiResponse<T = any> {
    status: number,
    message?: string,
    body?: T
}