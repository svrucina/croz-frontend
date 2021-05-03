import {Component, Input, OnInit, Output} from '@angular/core';
import {Post} from '../model/post.model';
import {User} from '../model/user.model';
import {AuthService} from '../shared/auth.service';
import {PostService} from '../shared/post.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post: Post;
  @Output() editPost = new Subject<Post>();
  user: User;

  constructor(private auth: AuthService, private postService: PostService) { }

  ngOnInit(): void {
    this.user = this.auth.getUser();
  }

  isAdmin(): boolean{
    return this.auth.isAdmin();
  }

  delete() {
    this.postService.deletePost(this.post.id);
  }

  edit(){
    this.editPost.next(this.post);
  }
}
