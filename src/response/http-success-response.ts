export class HttpSuccessResponse {
    private constructor(public statusCode: number, public body: string) { }

    static create(statusCode: number, body: object) {
        return new HttpSuccessResponse(statusCode, JSON.stringify(body));
    }
}