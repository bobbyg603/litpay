import { hello, token } from "../handler";
import * as event from "./event";

describe("handler", () => {

    describe("hello", () => {
        it("should return ApiGateway event", () => {
            hello(event, null, (err, response) => {
                expect(JSON.parse(response.body).input).toEqual(event);
            });
        });
    })

    describe("token", () => {
        it("should return a token", () => {
            token(null, null, (err, response) => {
                expect(JSON.parse(response.body).token).toEqual("abc123");
            })
        });
    });
})