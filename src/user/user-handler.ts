import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { User } from './user-model';
import { UserService } from './user-service';
import { DatabaseService } from '../database/database-service';
import { HttpErrorResponse } from '../response/http-error-response';
import { HttpSuccessResponse } from '../response/http-success-response';

export let injector = {
    userService: new UserService(new DatabaseService())
};

export const createUser: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
    // TODO BG does API gateway already handle this?
    if (event.httpMethod === "POST") {
        const requestBody = JSON.parse(event.body);

        if (!requestBody) {
            return cb(null, HttpErrorResponse.create(
                400, { message: "Missing request body" }
            ));
        }

        const user = new User(requestBody.firstName, requestBody.lastName);

        if (!user.firstName) {
            return cb(null, HttpErrorResponse.create(
                400, { message: "Missing required property: 'firstName'" }
            ));
        }

        if (!user.lastName) {
            return cb(null, HttpErrorResponse.create(
                400, { message: "Missing required property: 'lastName'" }
            ));
        }

        injector.userService.create(user, (error, data) => {
            if (error) {
                console.error(error);
                return cb(error, HttpErrorResponse.create(
                    500, { message: "Internal server error" }
                ));
            }
            return cb(null, HttpSuccessResponse.create(200, {
                message: "User created successfully.",
                data: { id: user.id }
            }));
        });
    } else {
        return cb(null, HttpErrorResponse.create(
            400, { message: `Method '${event.httpMethod}' not supported` })
        );
    }
}

export const getUser: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
    // TODO BG does API gateway already handle this?
    if (event.httpMethod === "GET") {
        const id = event.pathParameters.id;
        // TODO BG does API gateway already handle this?
        // I don't think you can get to this endpoint without an id
        if (!id) {
            return cb(null, HttpErrorResponse.create(
                400, { message: "Missing required path tparameter: id" }
            ));
        }

        injector.userService.get(id, (error, data) => {
            if (error) {
                console.error(error);
                return cb(error, HttpErrorResponse.create(
                    500, { message: "Internal server error" }
                ));
            }
            if (!data.Item) {
                return cb(error, HttpErrorResponse.create(
                    404, { message: "Unable to find user" }
                ));
            }
            return cb(null, HttpSuccessResponse.create(200, { data: data.Item }));
        });
    } else {
        return cb(null, HttpErrorResponse.create(
            400, { message: `Method '${event.httpMethod}' not supported` }
        ));
    }
}

export const updateUser: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
    // TODO BG does API gateway already handle this?
    if (event.httpMethod === "PUT") {
        const id = event.pathParameters.id;
        // TODO BG does API gateway already handle this?
        // I don't think you can get to this endpoint without an id
        if (!id) {
            return cb(null, HttpErrorResponse.create(
                400, { message: "Missing required path parameter: 'id'" }
            ));
        }

        const requestBody = JSON.parse(event.body);
        if (!requestBody) {
            return cb(null, HttpErrorResponse.create(
                400, { message: "Missing request body" }
            ));
        }

        const user = new User(requestBody.firstName, requestBody.lastName);
        user.id = id;

        injector.userService.update(user, (error, data) => {
            if (error) {
                console.error(error);
                return cb(null, HttpErrorResponse.create(
                    500, { message: "Internal server error" }
                ));
            }
            // TODO BG is this the only thing that can happen? Maybe a field was the wrong type?
            if (!data.Attributes) {
                return cb(error, HttpErrorResponse.create(
                    400, { message: `User with '${user.id}' does not exist` }
                ));
            }
            return cb(null, HttpSuccessResponse.create(
                200, {
                    message: `User ${user.id} updated successfully`,
                    data: data.Attributes
                }
            ));
        });
    } else {
        return cb(null, HttpErrorResponse.create(
            400, { message: `Method '${event.httpMethod}' not supported` }
        ));
    }
}

export const deleteUser: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
    // TODO BG does API gateway already handle this?
    if (event.httpMethod === "DELETE") {
        const id = event.pathParameters.id;
        // TODO BG does API gateway already handle this?
        // I don't think you can get to this endpoint without an id
        if (!id) {
            return cb(null, HttpErrorResponse.create(
                400, { message: "Missing required path parameter: 'id'" }
            ));
        }

        injector.userService.delete(id, (error, data) => {
            if (error) {
                console.error(error);
                return cb(error, HttpErrorResponse.create(
                    500, { message: "Internal server error" }
                ));
            }
            // TODO BG is this the only thing that can happen? Maybe a field was the wrong type?
            if (!data.Attributes) {
                return cb(error, HttpErrorResponse.create(
                    400, { message: `User with '${id}' does not exist` }
                ));
            }
            return cb(null, HttpSuccessResponse.create(
                200, {
                    message: "User deleted successfully",
                    data: data.Attributes
                }
            ));
        });
    } else {
        return cb(null, HttpErrorResponse.create(
            400, { message: `Method '${event.httpMethod}' not supported` }
        ));
    }
}