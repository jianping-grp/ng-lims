import {Injectable} from '@angular/core';
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/add/operator/map'
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subject} from "rxjs/Subject";

@Injectable()
export class AuthenticationService {
  private authUrl:string = 'http://localhost:8000/api/auth';
  currentUser:Subject<any>;
  constructor(private http: HttpClient) {
    this.currentUser = new Subject();
  }

  login(username: string, password: string):Observable<any> {
    return this.http.post(`${this.authUrl}/login/`, {username: username, password: password})
      .map((res: Response) => {
        if (res && res['auth_token']) {
          let user = {
            user_token:res['auth_token'],
            user_name:username
          };
          console.log('Login token:',user)
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUser.next(user);
          return user;
        }
        else {
          return null;
        }
      })
  }


  logout() :void{
    let storedUser = JSON.parse(localStorage.getItem('currentUser')) ;
    this.http.post(`${this.authUrl}/logout/`,{},{headers:new HttpHeaders().set('Authorization',`Token ${storedUser['user_token']}`)})

    localStorage.removeItem('currentUser');
    let removedToken = localStorage.getItem('currentUser');
    this.currentUser.next(removedToken);
  }

  registry(body:any){
    return this.http.post(`${this.authUrl}/register/`,body)
      .map((res:Response)=>res)
  }
}
