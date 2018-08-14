import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { dynamoClient } from '../db';

export const create: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    if (typeof data.text !== 'string') {
        console.error('Failed to add user');
        cb(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t create user.' 
        });
        return;
    }
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            // TODO: Need to create a uuid (uuid package?)
            userId: data.userId,
            userName: data.userName,
            createdAt: timestamp,
            updatedAt: timestamp,
        }
    }

    dynamoClient.put(params, (error) => {
        if (error) {
            console.error(error);
            cb(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t create the user.',
            });
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(params.Item),
        };
        cb(null, response);
    })
}