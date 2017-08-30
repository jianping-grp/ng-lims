import {Component, OnDestroy, OnInit} from '@angular/core';
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";
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
    private router:Router,
    private fb:FormBuilder
  ) {
    this.restService.currentUser.subscribe(
      user  => {
        this.currentUser = user;
        // this.username = user? user.user_name : user;
        // console.log(this.currentUser,this.username)
      }
    );

    this.signInForm=this.fb.group({
      username:[null, Validators.required],
      password:[null, Validators.required],
      // remember:[true]
    })
  }


  signInForm: FormGroup;

  signIn(){
    let username=this.signInForm.value.username;
    let password=this.signInForm.value.password;
    this.restService.login(username, password)
      .subscribe(
        // todo add return url, or user page
        user => {
          if (user){
            console.log(username ,'signed in, token is:' , user.user_token);
            // const preUrl = localStorage.getItem('currentUrl');
            // this.router.navigate([preUrl])
          }
        },
        error2 => {alert('用户名或密码不正确')},
        ()=>{
          const preUrl = localStorage.getItem('currentUrl');
          this.router.navigate([preUrl])
        }
        // todo add error handler
      )
  }

}
