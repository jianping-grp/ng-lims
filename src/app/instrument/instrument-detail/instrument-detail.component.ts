import {Component, OnInit} from '@angular/core';
import {Instrument} from '../../models/instrument';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {LimsRestService} from '../../service/lims-rest.service';
import {ScheduleReservation} from '../../models/schedule-reservation';
import {Reservation} from '../../models/reservation';
import * as moment from 'moment';
import {User} from "../../models/user";

import {InstrumentRecord} from "../../models/instrument-record";

@Component({
  selector: 'app-instrument-detail',
  templateUrl: './instrument-detail.component.html',
  styleUrls: ['./instrument-detail.component.css']
})
export class InstrumentDetailComponent implements OnInit {
  chartSchedule:boolean = false;

  currentUser:any;
  userInfo:User;
  admin:User;

  instrument: Instrument;

  scheduleEvents: ScheduleReservation[]=[];
  header: any;
  businessHours:any;

  // schedule
  min_sche: string;
  max_sche: string;
  event_Constraint: any;

  growlStyle:any;
  isUsing:boolean=false;

  constructor(
    private restService: LimsRestService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.growlStyle = {
      'top':'70px'
    }
    this.header = {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay listWeek'
    };

  }
  ngOnInit() {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'))
    this.currentUser = storedUser;
    const username:string = storedUser? storedUser['user_name']: storedUser;

    if (this.currentUser && username){
      this.restService.getUser(username).subscribe(
        user=>{
          console.log('我是登录的user:',user);
          this.userInfo=user[0]
        })
    }
    this.activatedRoute.params
    // (+) converts string 'id' to a number
      .subscribe(
        (params: Params) => this.getInstrument(+params['id']),
        (err: Error) => console.log(err)
      );
  }

  getInstrument(id: number) {
    this.restService.getInstrument(id)
      .subscribe(
        ins_users => {
          this.instrument = ins_users['instrument'];
          this.admin = ins_users['users'][0];
          console.log(this.instrument.id)
        },
        error => {},
        () => {
          this.min_sche = this.instrument.reservation_start_time ? this.instrument.reservation_start_time : '00:00';
          this.max_sche = this.instrument.reservation_end_time ? this.instrument.reservation_end_time : '24:00';
          this.event_Constraint = "businessHours";
          this.businessHours = {
            dow: [0,1,2,3,4,5,6],
            start: this.min_sche,
            end: this.max_sche
          };
          this.getInstrumentRecords(this.instrument.id);
          this.getReservation(this.instrument.id);
        }
      );
  }

  getInstrumentRecords(instrumentId:number){

    // 3个月之内的历史记录
    const pastTime = moment().subtract(3, 'months').format('YYYY-MM-DD');
    this.restService.getInstrumentRecords(instrumentId,pastTime).subscribe(
      (data:InstrumentRecord[])=>{
        let record_Users = data['users'];
        let instrumentRecords = data['instrument_records'];
        for(let p=0; p<instrumentRecords.length;p++){
          if (instrumentRecords[p].end_time){
            const event = new ScheduleReservation();
            event.userId = instrumentRecords[p].user;

            for (let i=0;i<record_Users.length;i++){
              if (event.userId == record_Users[i].id) {
                event.title = record_Users[i].last_name + record_Users[i].first_name;
                break;
              }
            }
            event.start = instrumentRecords[p].start_time;
            event.end = instrumentRecords[p].end_time;
            event.editable = false;
            event.backgroundColor = '#939593'; // 历史记录-真实使用时间

            this.scheduleEvents.push(event);
          }
          else {
            this.isUsing=true;
          }
        }
    })
  }

  getReservation(instrumentId: number) {
    const today = moment().format('YYYY-MM-DD');

    this.restService.getReservations(instrumentId,today)
      .subscribe(
        (data)=> {
          console.log('reservation data:',data)
          let allReservations= data['reservations'];
          let reservation_users = data['users'];
          const now_time = moment().format();

          //当前时间之后的预约情况
           for (let j=0;j<allReservations.length;j++) {
            if (this.isSameOrBefore(now_time,allReservations[j].end_time)){
              const event = new ScheduleReservation();
              event.id = allReservations[j].id;
              event.userId = allReservations[j].user;

              for (let i=0;i<reservation_users.length;i++){
                if (event.userId == reservation_users[i].id) {
                  event.title = reservation_users[i].last_name + reservation_users[i].first_name;
                  break;
                }
              }

              event.start = allReservations[j].start_time;
              event.end = allReservations[j].end_time;

              if (this.userInfo && (this.userInfo['id'] == event.userId)) {

                if (this.isSameOrBefore(now_time, event.start)) {
                  event.editable = true;
                  event.backgroundColor = '#23d271';
                }
                else {
                  event.editable = true;
                  event.startEditable=false;
                  event.backgroundColor = '#db8272'; // 正在使用中
                }
              }
              else {
                if (this.isSameOrBefore(now_time, event.start)) {
                  event.editable = false;
                }
                else {
                  event.editable = false;
                  event.backgroundColor = '#db8272'; // 正在使用中
                }
              }
                this.scheduleEvents.push(event);
            }
          }
        }
      )
  }

  isBefore(one, another):boolean {
    let pass = moment(one).isBefore(moment(another));
    return pass ? pass : false;
  }

  isSameOrBefore(one, another):boolean{
    let pass = moment(one).isSameOrBefore(moment(another));
    return pass ? pass : false;
  }

  toggle():void{
    this.chartSchedule = !this.chartSchedule;
  }

}


