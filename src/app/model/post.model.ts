import {User} from './user.model';

export class Post{
  id: number;
  comment: string;
  date: Date;
  updated: Date;
  author: User;

  constructor(id: number, comment: string, date: Date, updated: Date, author: User) {
    this.id = id;
    this.comment = comment;
    this.date = date;
    this.updated = updated;
    this.author = author;
  }
}
