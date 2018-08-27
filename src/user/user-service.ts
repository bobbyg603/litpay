import { DatabaseService } from '../database/database-service';
import { User } from './user-model';
import { AWSError } from 'aws-sdk';
import {
    PutItemOutput, GetItemOutput,
    UpdateItemOutput, DeleteItemOutput
} from 'aws-sdk/clients/dynamodb';

export class UserService {

    constructor(private databaseService: DatabaseService) { }

    create(user: User, callback: (error: AWSError, data: PutItemOutput) => void) {
        const timestamp = new Date().getTime();
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Item: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: timestamp,
                updatedAt: timestamp
            }
        };
        this.databaseService.put(params, callback);
    }

    get(id: string, callback: (error: AWSError, data: GetItemOutput) => void) {
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: { id: id }
        };
        this.databaseService.get(params, callback);
    }

    update(user: User, callback: (error: AWSError, data: UpdateItemOutput) => void) {
        const timestamp = new Date().getTime();
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: { id: user.id },
            ConditionExpression: 'id = :id',
            UpdateExpression: "set firstName = :fn, lastName = :ln, updatedAt = :ua",
            ExpressionAttributeValues: {
                ":id": user.id,
                ":fn": user.firstName,
                ":ln": user.lastName,
                ":ua": timestamp
            },
            ReturnValues: 'UPDATED_NEW'
        };
        this.databaseService.update(params, callback);
    }

    delete(id: string, callback: (error: AWSError, data: DeleteItemOutput) => void) {
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: { id: id },
            ReturnValues: 'ALL_OLD'
        };
        this.databaseService.delete(params, callback);
    }
}