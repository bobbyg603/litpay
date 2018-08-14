export class HttpErrorResponse {
    private constructor(public statusCode: number, public body: string) { }

    static create(statusCode: number, body: { message: string }) {
        return new HttpErrorResponse(statusCode, JSON.stringify(body));
    }
}