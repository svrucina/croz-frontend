import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/auth.service';
import {User} from '../model/user.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;
  authListener: Subscription;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.authListener = this.auth.authChange.subscribe((b: boolean) => {
      this.user = this.auth.getUser();
    });

    this.auth.whoAmI();
  }

}
