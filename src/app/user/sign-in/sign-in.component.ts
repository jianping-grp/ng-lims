import {Component, OnDestroy, OnInit} from '@angular/core';
import {Form} from "@angular/forms";
import {AuthenticationService} from "../../service/authentication.service";
import {Router} from "@angular/router";
import {LimsRestService} from "../../service/lims-rest.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  currentUser:any;
  user_token:string;

  constructor(
    private restService:LimsRestService,
    private router:Router
  ) {
    this.restService.currentUser.subscribe(
      user  => {
        this.currentUser = user;
        // this.username = user? user.user_name : user;
        // console.log(this.currentUser,this.username)
      }
    );
  }

  username:string;
  password:string;

  signInForm: Form;

  signIn(){
    this.restService.login(this.username, this.password)
      .subscribe(
        // todo add return url, or user page
        user => {
          if (user){
            console.log(this.username ,'signed in, token is:' , user.user_token);
            const preUrl = localStorage.getItem('currentUrl')
            this.router.navigate([preUrl])
          }
          else {
            alert('请重新登录')
          }
          // this.user_token = user['auth_token'];
        },
        error2 => {console.warn(error2)}
        // todo add error handler
      )
  }

}
