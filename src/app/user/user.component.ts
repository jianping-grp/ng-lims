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
      }
      );
    // this.limsRestService.getUser()
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.getUserReservation();
  }

  getUserReservation(){
      this.restService.getReservationsByUser(this.username).subscribe(
        data=>{
          console.log('获取预约历史')
        this.userInfo = data['users'][0];
        this.userReservations = data['reservations'];
      })
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

    if (confirm('确认退出当前用户?')){
      this.authenticationService.logout();
      this.userInfo = null;
      this.router.navigate(['/home'])
    }
  }

}
