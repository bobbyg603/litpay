import { createUser, getUser, updateUser, injector } from "../src/user/user-handler";
import { UserService } from "../src/user/user-service";

describe("user-handler", () => {
    describe("createUser", () => {
        it("should return 400 for unsupported request type", () => {
            const unsupportedMethod = "GET";
            createUser({ httpMethod: unsupportedMethod }, null, (err, response) => {
                expect(response.statusCode).toEqual(400);
                expect(JSON.parse(response.body).message).toEqual(
                    `Method '${unsupportedMethod}' not supported`
                );
            });
        });

        it("should return 400 request if missing request body", () => {
            const event = { httpMethod: "POST", body: JSON.stringify(null) };
            createUser(event, null, (err, response) => {
                expect(response.statusCode).toEqual(400);
                expect(JSON.parse(response.body).message).toEqual(
                    "Missing request body"
                );
            });
        });

        it("should return 400 request if missing property 'firstName'", () => {
            const event = { httpMethod: "POST", body: JSON.stringify({ foo: "bar" }) };
            createUser(event, null, (err, response) => {
                expect(response.statusCode).toEqual(400);
                expect(JSON.parse(response.body).message).toEqual(
                    "Missing required property 'firstName'"
                );
            });
        });

        it("should return 400 request if missing property 'lastName'", () => {
            const event = { httpMethod: "POST", body: JSON.stringify({ firstName: "Bart" }) };
            createUser(event, null, (err, response) => {
                expect(response.statusCode).toEqual(400);
                expect(JSON.parse(response.body).message).toEqual(
                    "Missing required property 'lastName'"
                );
            });
        });

        it("should call userService create with firstName and lastName", () => {
            const firstName = "Bart";
            const lastName = "Simpson";
            const event = { httpMethod: "POST", body: JSON.stringify({ firstName, lastName }) };
            injector.userService = jasmine.createSpyObj<UserService>("UserService", ["create"]);
            createUser(event, null, (err, response) => {
                const spy = <jasmine.Spy>injector.userService.create;
                const user = spy.calls.first().args[0];
                expect(response.statusCode).toEqual(200);
                expect(user.firstName).toEqual(firstName);
                expect(user.lastName).toEqual(lastName);
            });
        });
    });

    describe("getUser", () => {
        it("should return 400 for unsupported request type", () => {
            const unsupportedMethod = "POST";
            getUser({ httpMethod: unsupportedMethod }, null, (err, response) => {
                expect(response.statusCode).toEqual(400);
                expect(
                    JSON.parse(response.body).message
                ).toEqual(`Method '${unsupportedMethod}' not supported`);
            });
        });
        it("should call userService get with id and return with user", () => {
            const id = "409a2fd4-1f8b-4ec6-859b-d44a9ef9e702";
            const firstName = "Bart";
            const lastName = "Simpson";
            const event = { httpMethod: "GET", pathParameters: { id: id } };
            injector.userService = jasmine.createSpyObj<UserService>("UserService", ["get"]);
            getUser(event, null, (err, response) => {
                const spy = <jasmine.Spy>injector.userService.get;
                const user = spy.calls.first().args[0];
                expect(response.statusCode).toEqual(200);
                expect(user.firstName).toEqual(firstName);
                expect(user.lastName).toEqual(lastName);
            });
        });
    });

    describe("updateUser", () => {
        it("should return 400 for unsupported request type", () => {
            const unsupportedMethod = "POST";
            updateUser({ httpMethod: unsupportedMethod }, null, (err, response) => {
                expect(response.statusCode).toEqual(400);
                expect(
                    JSON.parse(response.body).message
                ).toEqual(`Method '${unsupportedMethod}' not supported`);
            });
        });
        it("should return 400 request if missing request body", () => {
            const id = "409a2fd4-1f8b-4ec6-859b-d44a9ef9e702";
            const event = { 
                httpMethod: "PUT", 
                pathParameters: { id: id }, 
                body: JSON.stringify(null) 
            };
            updateUser(event, null, (err, response) => {
                expect(response.statusCode).toEqual(400);
                expect(JSON.parse(response.body).message).toEqual(
                    "Missing request body"
                );
            });
        });
        it("should call userService update with id and return only with updated items", () => {
            // firstName = "Bart"; 
            // lastName = "Simpson";
            const id = "409a2fd4-1f8b-4ec6-859b-d44a9ef9e702";
            const changedLastName = "Blimpson";
            const event = { 
                httpMethod: "PUT", 
                pathParameters: { id: id },
                body: JSON.stringify({ lastName: changedLastName })
            };
            injector.userService = jasmine.createSpyObj<UserService>("UserService", ["update"]);
            updateUser(event, null, (err, response) => {
                const spy = <jasmine.Spy>injector.userService.update;
                const user = spy.calls.first().args[0];
                expect(response.statusCode).toEqual(200);
                expect(user.lastName).toEqual(changedLastName);
                expect(user.firstName).toBe(undefined);
            });
        });
    });
});