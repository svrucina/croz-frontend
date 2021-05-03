import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { User } from '../model/user.model';
import {Subscription} from 'rxjs';
import {PostService} from '../shared/post.service';
import {Post} from '../model/post.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: User;
  posts: Post[] = [];
  authListener: Subscription;
  messageListener: Subscription;
  postsListener: Subscription;
  message = '';
  editing = -1;
  form: FormGroup;
  point = -1; // change background color on post edit (post ID)

  constructor(private auth: AuthService, private postService: PostService) { }

  ngOnInit(): void {

      this.postsListener = this.postService.postEmitter.subscribe((posts: Post[]) => {
        this.posts = posts.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      });

      this.messageListener = this.postService.messageEmitter.subscribe((msg: string) => {
        if (!isNaN(+msg)){
          this.point = +msg;
          setTimeout(() => {
            this.point = -1;
          }, 1000);
        }else{
          this.message = msg;
        }
      });

      this.authListener = this.auth.authChange.subscribe((b: boolean) => {
          this.user = this.auth.getUser();
      });

      this.auth.whoAmI();
      this.postService.getPosts();
      this.form = new FormGroup({
        comment: new FormControl('', [Validators.required])
      });
  }

  logout(): void {
    this.auth.logout();
  }

  sendComment(): void{
    if (this.editing === -1) { this.postService.createPost(this.form.controls.comment.value); }
    else { this.postService.updatePost(this.editing, this.form.controls.comment.value); }
    this.cancel();
  }

  prepareForEdit(post: Post): void{
    this.editing = post.id;
    this.form.controls.comment.setValue(post.comment);
  }

  cancel() {
    this.editing = -1;
    this.form.controls.comment.setValue('');
  }

  toggleSwitch(values: any) {
    if (values.currentTarget.checked){
      this.posts = this.posts.filter((post: Post) => post.author.id === this.user.id);
    }else{
      this.posts = this.postService.loadPosts();
    }
  }

  ngOnDestroy(){
    this.authListener.unsubscribe();
    this.messageListener.unsubscribe();
    this.postsListener.unsubscribe();
  }
}
