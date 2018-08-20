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
    if (event.httpMethod === "POST") {
        const requestBody = JSON.parse(event.body);
  
        if (!requestBody) {
            return cb(null, HttpErrorResponse.create(
                400, { message: "Missing request body" }
            ));
        }
    
        const firstName = requestBody.firstName;
        const lastName = requestBody.lastName;
    
        if (!firstName) {
            return cb(null, HttpErrorResponse.create(
                400, { message: "Missing required property 'firstName'" }
            ));
        }
    
        if (!lastName) {
            return cb(null, HttpErrorResponse.create(
                400, { message: "Missing required property 'lastName'" }
            ));
        }
  
        const timestamp = new Date().getTime();
        const user = new User(firstName, lastName, timestamp, timestamp);
        injector.userService.create(user, (error, data) => {
            if (error) {
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
    if (event.httpMethod === "GET") {
        const id = event.pathParameters.id;
        // I don't think you can get to this endpoint without an id
        if (!id) {
            return cb(null, HttpErrorResponse.create(
                400, { message: "Missing id" }
            ));
        }

        injector.userService.get(id, (error, data) => {
            if (error) {
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
    if (event.httpMethod === "PUT") {
        const id = event.pathParameters.id;
        // I don't think you can get to this endpoint without an id
        if (!id) {
            return cb(null, HttpErrorResponse.create(
                400, { message: "Missing id" }
            ));
        }

        const requestBody = JSON.parse(event.body);
        if (!requestBody) {
            return cb(null, HttpErrorResponse.create(
                400, { message: "Missing request body" }
            ));
        } 

        const timestamp = new Date().getTime();
        const user = new User(
            requestBody.firstName,
            requestBody.lastName,
            null,
            timestamp
        );
        injector.userService.update(id, user, (error, data) => {
            if (error) {
                return cb(null, HttpErrorResponse.create(
                    500, { message: "Internal server error" }
                ));
            }
            if (!data.Attributes) {
                return cb(error, HttpErrorResponse.create(
                    404, { message: "Nothing was updated" }
                ));
            }
            return cb(null, HttpSuccessResponse.create(
                200, { 
                    message: "User updated successfully",
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
    if (event.httpMethod === "DELETE") {
        const id = event.pathParameters.id;
        // I don't think you can get to this endpoint without an id
        if (!id) {
            return cb(null, HttpErrorResponse.create(
                400, { message: "Missing id" }
            ));
        }

        injector.userService.delete(id, (error, data) => {
            // TODO Need to assure that the user was deleted or not
            if (error) {
                return cb(error, HttpErrorResponse.create(
                    500, { message: "Internal server error" }
                ));
            }
            if (!data.Attributes) {
                return cb(error, HttpErrorResponse.create(
                    404, { message: "Unable to delete user" }
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