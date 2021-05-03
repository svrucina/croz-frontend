import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService) { }

  form: FormGroup;
  errorListener: Subscription;
  errorMessage = '';

  ngOnInit(): void {

    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    this.errorListener = this.auth.errorEmitter
         .subscribe(res => {
           this.errorMessage = res;
    });
  }

  login(): void{
    const credentials = {
      username: this.form.value.username,
      password: this.form.value.password
    };
    this.auth.login(credentials);
  }

  ngOnDestroy(){
      this.errorListener.unsubscribe();
  }
}

