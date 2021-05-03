import {Authority} from './authority.model';

export class User{
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    authorities: Authority[];

    constructor(credentials: {id: number, username: string, first_name: string, last_name: string, authorities: Authority[]}){
        this.id = credentials.id;
        this.username = credentials.username;
        this.first_name = credentials.first_name;
        this.last_name = credentials.last_name;
        this.authorities = credentials.authorities;
    }
}
