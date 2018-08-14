import { DynamoDB, AWSError } from 'aws-sdk';
import { PutItemOutput, PutItemInput } from 'aws-sdk/clients/dynamodb';

export class DatabaseService {
 
    // Reasonable default property for property injection
    public databaseClient = new DynamoDB.DocumentClient({});

    // Additonal layer of abstraction for mocking/testing purposes
    put(params, callback: (err: AWSError, data: PutItemOutput) => void) {
        this.databaseClient.put(params, callback);
    }
}