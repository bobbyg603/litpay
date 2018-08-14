import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { HttpSuccessResponse } from './src/response/http-success-response';
import { UserService } from './src/user/user.service';
import { DatabaseService } from './src/database/database.service';
import { User } from './src/user/user.model';
import { HttpErrorResponse } from './src/response/http-error-response';

export let injector = {
  userService: new UserService(new DatabaseService())
};

export const hello: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'litpay!',
      input: event,
    }),
  };

  cb(null, response);
}

export const token: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      token: "abc123"
    })
  };

  cb(null, response);
}

export const user: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {

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

    try {
      const timestamp = new Date().getTime();
      const user = new User(firstName, lastName, timestamp, timestamp);
      injector.userService.create(user);
      return cb(null, HttpSuccessResponse.create(200, {}));
    } catch (error) {
      return cb(null, HttpErrorResponse.create(500, { message: error.message || error }));
    }
  } else {
    return cb(null, HttpErrorResponse.create(400, { message: `Method '${event.httpMethod}' not supported` }));
  }
}