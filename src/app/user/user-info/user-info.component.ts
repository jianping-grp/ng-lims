import { Component, OnInit } from '@angular/core';
import {LimsRestService} from "../../service/lims-rest.service";
import {User} from "../../models/user";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  currentUser:any;
  username:string;

  userInfo:User;

  constructor(
    private restService:LimsRestService,
  ) {
    let storedUser = JSON.parse(localStorage.getItem('currentUser'))
    this.currentUser = storedUser;
    this.username = storedUser? storedUser['user_name'] : storedUser;

    this.restService.currentUser.subscribe(
      user  => {
        this.currentUser = user;
        this.username = user? user.user_name : user;
      }
    );
  }

  ngOnInit() {
    this.getUser()
  }

  getUser(){
    this.restService.getUser(this.username).subscribe((users:User[])=>{
      this.userInfo = users[0];
    })
  }

}
