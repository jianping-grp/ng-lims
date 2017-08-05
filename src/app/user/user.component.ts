import {Component, Input, OnInit} from '@angular/core';
import {User} from "../models/user";
import {AuthenticationService} from "../service/authentication.service";
import {LimsRestService} from "../service/lims-rest.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  currentUser:any;
  username:string;

  constructor(
    private authenticationService:AuthenticationService,
    private limsRestService:LimsRestService,
    private router:Router
  ) {
    let storedUser = JSON.parse(localStorage.getItem('currentUser'))
    this.currentUser = storedUser;
    this.username = storedUser? storedUser['user_name'] : storedUser;

    this.authenticationService.currentUser.subscribe(
      user  => {
        this.currentUser = user;
        this.username = user? user.user_name : user;
        console.log('user-component',this.currentUser,this.username)
      }
      );
    // this.limsRestService.getUser()
  }

  ngOnInit() {
  }

  gotoLogin(){
    // localStorage.setItem('currentPage',location.href);
    if (location.href == 'http://localhost:4200/sign-up'){
      localStorage.setItem('currentUrl','home');
    }
    else {
      localStorage.setItem('currentUrl',location.pathname);
    }
    console.log(location.pathname)
    this.router.navigate(['./sign-in'])
  }

  logout(){
    this.authenticationService.logout();
  }

}
