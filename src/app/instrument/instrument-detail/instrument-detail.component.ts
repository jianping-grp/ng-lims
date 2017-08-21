import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Instrument} from '../../models/instrument';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {LimsRestService} from '../../service/lims-rest.service';
import {ScheduleReservation} from '../../models/schedule-reservation';
import {Reservation} from '../../models/reservation';
import * as moment from 'moment';
import {AuthenticationService} from "../../service/authentication.service";
import {User} from "../../models/user";
import {Message} from 'primeng/primeng';
import {now} from "moment";
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

  scheduleEvents: ScheduleReservation[];
  header: any;
  businessHours:any;

  // schedule
  min_sche: string;
  max_sche: string;
  event_Constraint: any;

  growlStyle:any;
  instrumentRecords:InstrumentRecord[]=[];

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
        error => {console.log('getInstrument method error:', error)},
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
        }
      );
  }
  getInstrumentRecords(instrumentId:number){
    this.restService.getInstrumentRecords(instrumentId).subscribe(
      (data:InstrumentRecord[])=>{
      this.instrumentRecords = data;
    },
      error => {console.log('getInstrumentRecords method error:', error)},
      ()=>{
        this.getReservation(instrumentId);
      }
    )
  }

  getReservation(instrumentId: number) {
    this.scheduleEvents = [];
    let allReservations:Reservation[]=[];
    let allUsers:User[]=[];
    this.restService.getReservations(instrumentId)
      .subscribe(
        (data)=> {
          allReservations= data['reservations'];
          allUsers = data['users'];
          const now_time = moment().format();
          this.instrumentRecords.map((instruRecord:InstrumentRecord)=>{
            if (instruRecord.end_time && this.isBefore(instruRecord.end_time,now_time)){
              const event = new ScheduleReservation();
              // event.id = instruRecord.id;
              event.userId = instruRecord.user;

              for (let i=0;i<allUsers.length;i++){
                if (event.userId == allUsers[i].id) {
                  event.title = allUsers[i].last_name + allUsers[i].first_name;
                  break;
                }
              }

              event.start = instruRecord.start_time;
              event.end = instruRecord.end_time;

              event.editable = false;
              event.backgroundColor = '#939593'; // 历史记录-真实使用时间

              // 只显示过去3个月以来的日程安排；
              const today = moment();
              const lastMonths = today.subtract(3, 'months').format();
              if (moment(event.start).isSameOrAfter(lastMonths)) {
                this.scheduleEvents.push(event);
              }
            }
          });
          allReservations.map((reservation:Reservation) => {
            if (this.isSameOrBefore(now_time,reservation.end_time)){
              const event = new ScheduleReservation();
              event.id = reservation.id;
              event.userId = reservation.user;

              for (let i=0;i<allUsers.length;i++){
                if (event.userId == allUsers[i].id) {
                  event.title = allUsers[i].last_name + allUsers[i].first_name;
                  break;
                }
              }

              event.start = reservation.start_time;
              event.end = reservation.end_time;

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
          })
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


