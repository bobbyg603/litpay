import { v4 } from 'uuid';

export class User {

    public id: string = v4();
    public createdAt: number;
    public updatedAt: number;

    constructor(
        public firstName: string,
        public lastName: string,
    ) { }
}