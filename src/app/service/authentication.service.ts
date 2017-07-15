import {Injectable} from '@angular/core';
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {

  constructor(private http: Http) {
  }

  login(username: string, password: string) {
    return this.http.post('http://localhost:8000/auth/login/', {username: username, password: password})
      .map((res: Response) => {
        let user = res.json();
        if (user && user.auth_token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return user;
      })
  }

  logout() {
    localStorage.removeItem('currentUser');
  }
}
