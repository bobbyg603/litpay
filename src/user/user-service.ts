import { DatabaseService } from '../database/database-service';
import { User } from './user-model';
import { AWSError } from 'aws-sdk';
import { PutItemOutput, GetItemOutput, 
    UpdateItemOutput, DeleteItemOutput } from 'aws-sdk/clients/dynamodb';

export class UserService {

    constructor(private databaseService: DatabaseService) { }

    create(user: User, callback: (error: AWSError, data: PutItemOutput) => void) {
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Item: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
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

    update(id: string, user: User, callback: (error: AWSError, data: UpdateItemOutput) => void) {
        const firstName = user.firstName;
        const lastName = user.lastName;
        let expressionAttributeValues = { ':id': id, ':ua': user.updatedAt };
        let updateExpression = 'SET ';
        if (firstName) { 
            updateExpression += 'firstName = :fn, ';
            expressionAttributeValues[':fn'] = firstName;
        };
        if (lastName) {
            updateExpression += 'lastName = :ln, '
            expressionAttributeValues[':ln'] = lastName;
        };
        updateExpression += 'updatedAt = :ua';

        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: { id: id },
            UpdateExpression: updateExpression,
            ConditionExpression: 'id = :id',
            ExpressionAttributeValues: expressionAttributeValues,
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