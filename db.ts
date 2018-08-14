import { DynamoDB } from 'aws-sdk';

let options = {};

export const dynamoClient = new DynamoDB.DocumentClient(options);