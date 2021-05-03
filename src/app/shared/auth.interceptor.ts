import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = this.auth.getToken();

        if (token){
            const headers = new HttpHeaders({
              Authorization: 'Bearer ' + token,
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json'
            });
            const copiedReq = request.clone({headers});
            return next.handle(copiedReq);

        } else {
            return next.handle(request);
        }



    }

}
