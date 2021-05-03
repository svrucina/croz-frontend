import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {User} from '../model/user.model';

@Injectable()
export class AuthService {

  private user: User;
  private token: string;
  errorEmitter: Subject<string> = new Subject<string>();
  authChange: Subject<boolean> = new Subject<boolean>();
  authUrl: string = environment.API_URL + '/api/authenticate';
  registerUrl: string = environment.API_URL + '/api/register';

  constructor(private http: HttpClient, private router: Router) {
      this.token = '';
  }

  register(credentials: {username: string, password: string, first_name: string, last_name: string}){
    this.http.post(this.registerUrl, credentials).subscribe(
      (res) => {
        this.router.navigate(['/login']);
      },
      (err) => {
        this.errorEmitter.next(err.error);
      }
    );
  }

  login(credentials: {username: string, password: string}){

    this.http.post(this.authUrl, credentials)
        .subscribe((res: {token: string}) => {
            this.token = res.token;
            localStorage.setItem('token', this.token);
            this.authChange.next(true);
            this.router.navigate(['/']);
        },
          (err: {status}) => {if (err.status === 401) { this.errorEmitter.next('Wrong username or password'); }
                              else { this.errorEmitter.next('Something went wrong.'); }}
        );

  }

  logout(){
    this.user = null;
    this.token = null;
    localStorage.removeItem('token');
    this.authChange.next(false);
    this.router.navigate(['login']);
  }

  getUser(){
    if (this.user) {
    return {...this.user};
    } else { return null; }
  }

  getToken(){

    if (this.token) { return this.token; } else {
      if (localStorage.getItem('token')){
        this.token = localStorage.getItem('token');
        return this.token;
      }
      return '';
    }

  }

  isAuthenticated(){
    return this.user != null;
  }

  isAdmin(){
        if (this.isAuthenticated()){
          if (Array.isArray(this.user.authorities)) { return this.user.authorities.some((authority) => authority.name === 'ROLE_ADMIN'); }
        }
        return false;
  }

  whoAmI(){
      return this.http.get(environment.API_URL + '/api/me')
          .subscribe((response: User) => {
              this.user = response;
              this.authChange.next(true);
          }, (err) => {
            console.log(err.error);
            if (!(this.router.url === '/login' || this.router.url === '/register')) { this.logout(); }
          });
  }

}
