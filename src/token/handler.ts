import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

export const tokenHandler: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      token: "abc123"
    })
  };

  cb(null, response);
}