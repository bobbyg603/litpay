import { createUser, getUser, updateUser, deleteUser, injector } from "../src/user/user-handler";
import { UserService } from "../src/user/user-service";
import { User } from "../src/user/user-model";

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
                    "Missing required property: 'firstName'"
                );
            });
        });

        it("should return 400 request if missing property 'lastName'", () => {
            const event = { httpMethod: "POST", body: JSON.stringify({ firstName: "Bart" }) };
            createUser(event, null, (err, response) => {
                expect(response.statusCode).toEqual(400);
                expect(JSON.parse(response.body).message).toEqual(
                    "Missing required property: 'lastName'"
                );
            });
        });

        it("should call userService create with firstName and lastName", () => {
            const expectedFirstName = "Bart";
            const expectedLastName = "Simpson";
            const event = {
                httpMethod: "POST",
                body: JSON.stringify({
                    firstName: expectedFirstName,
                    lastName: expectedLastName
                })
            };
            injector.userService = jasmine.createSpyObj<UserService>("UserService", ["create"]);
            createUser(event, null, (err, response) => {
                const spy = <jasmine.Spy>injector.userService.create;
                const result = spy.calls.first().args[0];
                expect(response.statusCode).toEqual(200);
                expect(result.firstName).toEqual(expectedFirstName);
                expect(result.lastName).toEqual(expectedLastName);
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

        it("should call userService get with correct id", () => {
            const expectedId = "409a2fd4-1f8b-4ec6-859b-d44a9ef9e702";
            const expectedFirstName = "Bart";
            const expectedLastName = "Simpson";
            const event = { httpMethod: "GET", pathParameters: { id: expectedId } };
            injector.userService = jasmine.createSpyObj<UserService>("UserService", ["get"]);
            getUser(event, null, (err, response) => {
                const spy = <jasmine.Spy>injector.userService.get;
                const result = spy.calls.first().args[0];
                expect(response).toEqual(200);
                expect(result.id).toEqual(expectedId);
                expect(result.firstName).toEqual(expectedFirstName);
                expect(result.lastName).toEqual(expectedLastName);
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

        it("should call userService update with correct id, firstName and lastName", () => {
            const expectedUser = new User("Eric", "Cartman");
            expectedUser.id = "409a2fd4-1f8b-4ec6-859b-d44a9ef9e702";
            const event = {
                httpMethod: "PUT",
                pathParameters: { id: expectedUser.id },
                body: JSON.stringify(expectedUser)
            };
            injector.userService = jasmine.createSpyObj<UserService>("UserService", ["update"]);
            updateUser(event, null, (err, response) => {
                const spy = <jasmine.Spy>injector.userService.update;
                const result = spy.calls.first().args[0];
                expect(response).toEqual(200);
                expect(result.id).toEqual(expectedUser.id);
                expect(result.firstName).toEqual(expectedUser.firstName);
                expect(response.body.lastName).toEqual(expectedUser.lastName);
            });
        });
    });

    describe("deleteUser", () => {
        it("should return 400 for unsupported request type", () => {
            const unsupportedMethod = "POST";
            deleteUser({ httpMethod: unsupportedMethod }, null, (err, response) => {
                expect(response.statusCode).toEqual(400);
                expect(
                    JSON.parse(response.body).message
                ).toEqual(`Method '${unsupportedMethod}' not supported`);
            });
        });

        it("should call userService delete with correct id", () => {
            const expectedId = "409a2fd4-1f8b-4ec6-859b-d44a9ef9e702";
            const event = { httpMethod: "DELETE", pathParameters: { id: expectedId } };
            injector.userService = jasmine.createSpyObj<UserService>("UserService", ["delete"]);
            deleteUser(event, null, (err, response) => {
                const spy = <jasmine.Spy>injector.userService.delete;
                const result = spy.calls.first().args[0];
                expect(response).toEqual(200);
                expect(result.id).toEqual(expectedId);
            });
        });
    });
});