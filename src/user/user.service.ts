import { DatabaseService } from '../database/database.service';
import { User } from './user.model';
import { AWSError } from 'aws-sdk';
import { PutItemOutput } from 'aws-sdk/clients/dynamodb';

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
}