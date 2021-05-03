import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private auth: AuthService) { }

  errorListener: Subscription;
  errorMessage = '';
  form: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required]),
      repeat: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required])
    });
    this.errorListener = this.auth.errorEmitter
         .subscribe(res => {
           this.errorMessage = res;
    });
  }

  register(): void {
    const credentials = {
      username: this.form.value.username,
      password: this.form.value.password,
      first_name: this.form.value.first_name,
      last_name: this.form.value.last_name
    };
    this.auth.register(credentials);
  }

  ngOnDestroy(){
      this.errorListener.unsubscribe();
  }

}
