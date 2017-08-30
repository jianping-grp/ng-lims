import { Component } from '@angular/core';
import {Reservation} from "../../models/reservation";
import {InstrumentRecord} from "../../models/instrument-record";
import {Meta} from "../../models/meta";
import {LimsRestService} from "../../service/lims-rest.service";
import * as moment from "moment";

@Component({
  selector: 'app-user-record',
  templateUrl: './user-record.component.html',
  styleUrls: ['./user-record.component.css']
})
export class UserRecordComponent{
  currentUser:any;
  username:string;

  userReservations:Reservation[]=[];
  userRecords:InstrumentRecord[]=[];
  meta_reservation:Meta;
  meta_record:Meta;

  ageSort='false';
  _loading:boolean=true;
  _current:number=1;
  _total:number=1;

  _loading2:boolean=true;
  _current2:number=1;
  _total2:number=1;

  pastTime:string;

  months_record:number=3;

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
    this.pastTime = moment().subtract(this.months_record, 'months').format('YYYY-MM-DD');

    this._refreshData();
    this._refreshData2()
  }

  isBefore(one, another):boolean {
    let pass = moment(one).isBefore(moment(another));
    return pass ? pass : false;
  }

  ageSortChange(e){
    console.log('ageSortChange:',e)
    if (e === 'ascend') {
      this.userReservations = [ ...this.userReservations.sort((a, b) => {
        if (this.isBefore(a.start_time,b.start_time)){
          return -1;
        }
        else {
          return 1;
        }
      }) ];
    } else if (e === 'descend') {
      this.userReservations = [ ...this.userReservations.sort((a, b) => {
        if (this.isBefore(a.start_time,b.start_time)){
          return 1;
        }
        else {
          return -1;
        }
      }) ];
    }
  }
  ageSortChange2(e){
    console.log('ageSortChange:',e)
    if (e === 'ascend') {
      this.userRecords = [ ...this.userRecords.sort((a, b) => {
        if (this.isBefore(a.start_time,b.start_time)){
          return -1;
        }
        else {
          return 1;
        }
      }) ];
    } else if (e === 'descend') {
      this.userRecords = [ ...this.userRecords.sort((a, b) => {
        if (this.isBefore(a.start_time,b.start_time)){
          return 1;
        }
        else {
          return -1;
        }
      }) ];
    }
  }
  _refreshData(){
    this._loading=true;
    this.restService.getReservationsByPage(this.username,this._current,this.pastTime).subscribe(data=>{
      this._loading=false;
      this.userReservations = data['reservations'];
      this.meta_reservation = data['meta'];
      this._current=this.meta_reservation.page;
      this._total=this.meta_reservation.total_results;
    })
  }

  _refreshData2(){
    this._loading2=true;
    this.restService.getInstrumentRecordsByPage(this.username,this._current2,this.pastTime).subscribe(data=>{
      this.userRecords=data['instrument_records'];
      this.meta_record = data['meta'];
      this._loading2=false;
      this._current2=this.meta_record.page;
      this._total2=this.meta_record.total_results;
    })
  }


}
