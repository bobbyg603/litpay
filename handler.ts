import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { tokenHandler } from './src/token/handler';

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

export const token: Handler = tokenHandler;