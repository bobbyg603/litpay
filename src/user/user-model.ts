import { v4 } from 'uuid';

export class User {

    public id: string = v4();

    constructor(
        public firstName: string,
        public lastName: string,
        public createdAt: number,
        public updatedAt: number
    ) { }
}