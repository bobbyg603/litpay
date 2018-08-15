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
        return cb(null, HttpErrorResponse.create(400, { message: "Missing request body" }));
      }
  
      const firstName = requestBody.firstName;
      const lastName = requestBody.lastName;
  
      if (!firstName) {
        return cb(null, HttpErrorResponse.create(400, { message: "Missing required property 'firstName'" }));
      }
  
      if (!lastName) {
        return cb(null, HttpErrorResponse.create(400, { message: "Missing required property 'lastName'" }));
      }
  
      const timestamp = new Date().getTime();
      const user = new User(firstName, lastName, timestamp, timestamp);
      injector.userService.create(user, (error, data) => {
        if (error) {
          return cb(error, HttpErrorResponse.create(500, { message: "Internal server error" }));
        }
        return cb(null, HttpSuccessResponse.create(200, { 
          message: "User created successfully.",
          id: user.id
        }));
      });
  
    } else {
      return cb(null, HttpErrorResponse.create(400, { message: `Method '${event.httpMethod}' not supported` }));
    }
}

export const getUser: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
    if (event.httpMethod === "GET") {
  
      const id = event.pathParameters.id;
      
      // I don't think you can get to this endpoint without an id
      if (!id) {
        return cb(null, HttpErrorResponse.create(400, { message: "Missing id." }));
      }

      injector.userService.get(id, (error, data) => {
        if (error) {
          return cb(error, HttpErrorResponse.create(500, { message: "Internal server error" }));
        }
        return cb(null, HttpSuccessResponse.create(200, data.Item));
      });
  
    } else {
      return cb(null, HttpErrorResponse.create(400, { message: `Method '${event.httpMethod}' not supported` }));
    }
}