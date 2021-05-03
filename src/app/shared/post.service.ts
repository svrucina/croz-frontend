import { Injectable } from '@angular/core';
import {Post} from '../model/post.model';
import {Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private posts: Post[];
  postEmitter: Subject<Post[]> = new Subject<Post[]>();
  messageEmitter: Subject<string> = new Subject<string>();
  private postUrl = environment.API_URL + '/posts';

  constructor(private http: HttpClient) { }

  getPosts(){
    this.http.get(this.postUrl).subscribe((response: Post[]) => {
      if (response.length === 0){
        this.messageEmitter.next('Ne postoji niti jedan post.');
      }
      this.posts = response;
      this.postEmitter.next(this.posts);
    }, (error) => {
      this.messageEmitter.next(error);
    });
  }

  updatePost(id: number, message: string){
    const URL = `${this.postUrl}?postID=${id}`;
    this.http.put(URL, {comment: message}).subscribe((post: Post) => {
      const itemIndex = this.posts.findIndex(editingPost => editingPost.id === post.id);
      this.posts[itemIndex] = post;
      this.postEmitter.next(this.posts);
      this.messageEmitter.next(post.id.toString());
    }, (error) => {
      this.messageEmitter.next(error);
    });
  }

  createPost(message: string){
    this.http.post(this.postUrl, {comment: message}).subscribe((post: Post) => {
      this.posts.push(post);
      this.postEmitter.next(this.posts);
      this.messageEmitter.next(post.id.toString());
    }, (error) => {
      this.messageEmitter.next(error);
    });
  }

  deletePost(id: number){
    const URL = `${this.postUrl}?postID=${id}`;
    this.http.delete(URL).subscribe((postID: number) => {
      this.messageEmitter.next(`Post obrisan [${postID}].`);
      this.posts = this.posts.filter(post => post.id !== postID);
      this.postEmitter.next(this.posts);
    }, (error) => {
      this.messageEmitter.next(error);
    });
  }

  loadPosts(): Post[]{
    if (this.posts.length < 1) { this.getPosts(); }
    return this.posts;
  }
}
