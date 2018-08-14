import { hello, token, user, injector } from "../handler";
import * as event from "./event";
import { UserService } from "../src/user/user.service";

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
    
    describe("user", () => {
        it("should return 400 for unsupported request type", () => {
            const unsupportedMethod = "GET";
            user({ httpMethod: unsupportedMethod }, null, (err, response) => {
                expect(response.statusCode).toEqual(400);
                expect(JSON.parse(response.body).message).toEqual(`Method '${unsupportedMethod}' not supported`);
            });
        });

        it("should return 400 request is missing request body", () => {
            const event = { httpMethod: "POST", body: JSON.stringify(null) };
            user(event, null, (err, response) => {
                expect(response.statusCode).toEqual(400);
                expect(JSON.parse(response.body).message).toEqual("Missing request body");
            });
        });

        it("should return 400 request is missing property 'firstName'", () => {
            const event = { httpMethod: "POST", body: JSON.stringify({ foo: "bar" }) };
            user(event, null, (err, response) => {
                expect(response.statusCode).toEqual(400);
                expect(JSON.parse(response.body).message).toEqual("Missing required property 'firstName'");
            });
        });

        it("should return 400 request is missing property 'lastName'", () => {
            const event = { httpMethod: "POST", body: JSON.stringify({ firstName: "Bart" }) };
            user(event, null, (err, response) => {
                expect(response.statusCode).toEqual(400);
                expect(JSON.parse(response.body).message).toEqual("Missing required property 'lastName'");
            });
        });

        it("should call userService with firstName and lastName", () => {
            const firstName = "Bart";
            const lastName = "Simpson";
            const event = { httpMethod: "POST", body: JSON.stringify({ firstName, lastName }) };
            injector.userService = jasmine.createSpyObj<UserService>("UserService", ["create"]);
            user(event, null, (err, response) => {
                const spy = <jasmine.Spy>injector.userService.create;
                const user = spy.calls.first().args[0];
                expect(response.statusCode).toEqual(200);
                expect(user.firstName).toEqual(firstName);
                expect(user.lastName).toEqual(lastName);
            });
        });
    });
})