import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {User} from "../models/user";
import {AuthenticationService} from "../service/authentication.service";
import {LimsRestService} from "../service/lims-rest.service";
import {Router} from "@angular/router";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Reservation} from "../models/reservation";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  currentUser:any;
  username:string;
  userInfo:User;
  userReservations:Reservation[];
  modalRef: BsModalRef;

  constructor(
    private authenticationService:AuthenticationService,
    private restService:LimsRestService,
    private router:Router,
    private modalService: BsModalService
  ) {
    let storedUser = JSON.parse(localStorage.getItem('currentUser'))
    this.currentUser = storedUser;
    this.username = storedUser? storedUser['user_name'] : storedUser;

    this.authenticationService.currentUser.subscribe(
      user  => {
        this.currentUser = user;
        this.username = user? user.user_name : user;
        // if (this.username){
        //   this.getUserInfo(this.username);
        // }
        // this.userInfo = user? this.getUserInfo(user.user_name):user

      }
      );
    // this.limsRestService.getUser()
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.getUserReservation();
  }

  // getUserInfo(){
  //   if (!this.userInfo){
  //     this.restService.getUser(this.currentUser.user_name).subscribe(
  //       (users:User[])=> {
  //         console.log(users[0]);
  //         this.userInfo = users[0]
  //       }
  //     )
  //   }
  // }
  getUserReservation(){
    if (!this.userInfo){
      this.restService.getReservationsByUser(this.username).subscribe(
        data=>{
        this.userInfo = data['users'][0];
        this.userReservations = data['reservations'];
      })
    }
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
    this.router.navigate(['./sign-in'])
  }

  logout(){
    this.authenticationService.logout();
    this.userInfo = null;
  }

}
