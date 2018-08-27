import { DynamoDB, AWSError } from 'aws-sdk';
import { PutItemOutput, GetItemOutput, 
    UpdateItemOutput, DeleteItemOutput } from 'aws-sdk/clients/dynamodb';

export class DatabaseService {
 
    public databaseClient = new DynamoDB.DocumentClient({});

    put(params, callback: (err: AWSError, data: PutItemOutput) => void) {
        this.databaseClient.put(params, callback);
    }

    get(params, callback: (err: AWSError, data: GetItemOutput) => void) {
        this.databaseClient.get(params, callback);
    }

    update(params, callback: (err: AWSError, data: UpdateItemOutput) => void) {
        this.databaseClient.update(params, callback);
    }

    delete(params, callback: (err: AWSError, data: DeleteItemOutput) => void) {
        this.databaseClient.delete(params, callback);
    }
}