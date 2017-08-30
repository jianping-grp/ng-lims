import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {User} from "../../models/user";
import {LimsRestService} from "../../service/lims-rest.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  currentUser:any;
  username:string;

  userInfo:User;
  isVisibleTop:boolean;
  constructor(
    private restService:LimsRestService,
    private router:Router,
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
  }

  // getUser(){
  //   this.isVisibleTop = true;
  //   this.restService.getUser(this.username).subscribe((users:User[])=>{
  //     this.userInfo = users[0];
  //   })
  // }
  // handleOkTop (e) {
  //   console.log('点击了确定');
  //   this.isVisibleTop = false;
  // }
  //
  // handleCancelTop (e) {
  //   console.log('取消');
  //   this.isVisibleTop = false;
  // }

  gotoLogin(){
    // localStorage.setItem('currentPage',location.href);
    if (location.href == 'http://localhost:4200/user-center/sign-up'){
      localStorage.setItem('currentUrl','home');
    }
    else {
      localStorage.setItem('currentUrl',location.pathname);
    }
    this.router.navigate(['./user-center/sign-in'])
  }

  logout(){

    if (confirm('确认退出当前用户?')){
      this.restService.logout();
      // this.userInfo = null;
      this.router.navigate(['/home'])
    }
  }

}
