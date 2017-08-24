import { Component } from '@angular/core';
import {Reservation} from "../../models/reservation";
import {InstrumentRecord} from "../../models/instrument-record";
import {Meta} from "../../models/meta";
import {LimsRestService} from "../../service/lims-rest.service";
import {AuthenticationService} from "../../service/authentication.service";

@Component({
  selector: 'app-user-record',
  templateUrl: './user-record.component.html',
  styleUrls: ['./user-record.component.css']
})
export class UserRecordComponent{
  currentUser:any;
  username:string;

  userReservations:Reservation[];
  userRecords:InstrumentRecord[];
  meta_reservation:Meta;
  meta_record:Meta;

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

  getReservationByPage(e?:number){
      this.restService.getReservationsByPage(this.username,e).subscribe(data=>{
        console.log('e存在,getReservaionBypage:',data);
        this.userReservations = data['reservations'];
        this.meta_reservation = data['meta'];
      })
  }
  getRecordsByPage(e?:number){
      this.restService.getInstrumentRecordsByPage(this.username,e).subscribe(data=>{
        console.log('e存在,records',data)
        this.userRecords=data['instrument_records'];
        this.meta_record = data['meta']
      })
  }

}
