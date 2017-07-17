import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Instrument} from '../../models/instrument';
import {ActivatedRoute, Params} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {LimsRestService} from '../../service/lims-rest.service';
import {ScheduleReservation} from '../../models/schedule-reservation';
import set = Reflect.set;
import {Reservation} from '../../models/reservation';
import {Http} from '@angular/http';

// export class ScheduleReservation{
//   id:number;
//   title:string;
//   start:string;
//   end:string;
//   // allDay:boolean = true
// }

@Component({
  selector: 'app-instrument-detail',
  templateUrl: './instrument-detail.component.html',
  styleUrls: ['./instrument-detail.component.css']
})
export class InstrumentDetailComponent implements OnInit{
  instrument: Instrument;
  errorMsg: string;
  instrumentId:number;
  // todo clean this code
  scheduleEvents: any[];
  event: ScheduleReservation;
  header:any;
  dialogVisible:boolean=false;
  idGen:number=100;


  constructor(
           private restService: LimsRestService,
           private route: ActivatedRoute,
           private http:Http,
           private cd : ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    // this.scheduleEvents = [
    //   {
    //     'title': '小红',
    //     'start': '2017-07-16T08:00:00',
    //     'end': '2017-07-16T14:00:00'
    //   },
    //   {
    //     'title': '李亮预约',
    //     'start': '2017-07-17T08:00:00',
    //     'end': '2017-07-17T14:00:00'
    //   },
    //   {
    //     'title': '张竞预约',
    //     'start': '2017-07-17T15:00:00',
    //     'end': '2017-07-17T17:30:00'
    //   },
    //   {
    //     'title': '小王',
    //     'start': '2017-07-16T16:00:00Z',
    //     'end': '2017-07-16T18:00:00Z'
    //   },
    //   {
    //     'title': '全程会议',
    //     'start': '2017-07-11',
    //     'end': '2017-07-13'
    //   }
    // ]
    this.header = {
      left: 'prev listWeek next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    };
    this.route.params
    // (+) converts string 'id' to a number
      .subscribe((params: Params) => this.getInstrument(+params['id']));
  }
  getInstrument(id: number) {
    this.restService.getInstrument(id)
      .subscribe(
        instrument => {
          console.log('选中的instrument信息：' , instrument)
          this.instrument = instrument;
          this.instrumentId =instrument.id;
          this.getReservation(this.instrument.id);
        },
        error => this.errorMsg = error
      );
  }
  getReservation(instrumentId: number) {
    this.scheduleEvents = [];
    this.restService.getReservation(instrumentId)
      .subscribe(
        allReservations => {
          console.log('选中的instrument的所有预约情况' , allReservations)
          allReservations.map(reservation => {
            const event = new ScheduleReservation;
            event['id']=reservation.id;
            event['title'] = reservation.user.last_name + reservation.user.first_name;
            event['start'] = reservation.start_time ;
            event['end'] = reservation.end_time ;
            this.scheduleEvents.push(event);
          })
        }
      )
    // console.log(this.scheduleEvents)
  }
  // todo 现在实现了scheduleEvents换成新的 它会自动更新。下面做向后台发送的。


  // start.stripTime().format()可以将日期转化成yyyy-mm-dd;
  handleEventClick(e){
    this.event = new ScheduleReservation();
    this.event.title = e.calEvent.title;

    let start = e.calEvent.start;
    let end = e.calEvent.end;
    if (e.view.name === 'month'){
      start.stripTime()
    }
    if (start){
      start.stripTime();
      this.event.start = start.format()// start.stripTime().format()可以将日期转化成yyyy-mm-dd；
    }
    if (end){
      end.stripTime();
      this.event.end = end.format();
    }
    this.event.id = e.calEvent.id;
    console.log('EventClick时，得到事件的开始时间格式，start.stripTime().format():',start.stripTime().format());

    // this.event.allDay = e.calEvent.allDay;
    this.dialogVisible = true;
  }

  handleDayClick(e){

    this.event = new ScheduleReservation();
    console.log('DayClick时，得到事件的开始时间格式，start.format()|start.stripTime():',e.date.format(),'|',e.date.stripTime());
    this.event.start = e.date.stripTime().format();

    this.dialogVisible = true;
    this.cd.detectChanges()
  }
// todo 下一步做save和delete；
  saveEvent(){
    //update
    if (this.event.id){
      let index:number = this.findEventIndexById(this.event.id);
      if (index >= 0){
        this.scheduleEvents[index] = this.event;
      }
    }
    else {
      this.event.id = this.idGen++;
      this.scheduleEvents.push(this.event);
      this.event = null;
    }
  }

  findEventIndexById(id:number){
    let index = -1;
    for (let i = 0;i<this.scheduleEvents.length;i++){
      if (id == this.scheduleEvents[i].id){
        index = i;
        break;
      }
    }
    return index;
  }

  reserve(){
    // const newReservation= new Reservation;
    // let body1={
    //   "start_time":this.scheduleEvents[0].start,
    //   "end_time":this.scheduleEvents[0].end
    // }
    let body2=[{
      "id": 1,
      "user": {
      "id": 12,
        "password": "pbkdf2_sha256$36000$9izMGBeZUcNl$+jK2KnkGVKZo+aZF5dp+1TzPuInZlo8YdRF2+uzp2Tw=",
        "last_login": null,
        "is_superuser": false,
        "username": "zhonghua",
        "first_name": "中华",
        "last_name": "王",
        "email": "zhonghua@tjab.org",
        "is_staff": false,
        "is_active": true,
        "date_joined": "2017-07-12T07:16:00Z",
        "phone": null,
        "birth_date": null,
        "groups": [],
        "user_permissions": []
    },
      "start_time": "2017-07-12T09:17:00Z",
      "end_time": "2017-07-12T12:17:00Z",
      "instrument": 5
    }]
    this.http.put('http://localhost:8000/api/reservation/?instrument=5',body2)
      // .map((res:Response)=>res.json())
      .subscribe(data=>console.log(data))

    // console.log(this.scheduleEvents)
  }

}

// {
//   "id": 1,
//   "user": {
//   "id": 12,
//     "password": "pbkdf2_sha256$36000$9izMGBeZUcNl$+jK2KnkGVKZo+aZF5dp+1TzPuInZlo8YdRF2+uzp2Tw=",
//     "last_login": null,
//     "is_superuser": false,
//     "username": "zhonghua",
//     "first_name": "中华",
//     "last_name": "王",
//     "email": "zhonghua@tjab.org",
//     "is_staff": false,
//     "is_active": true,
//     "date_joined": "2017-07-12T07:16:00Z",
//     "phone": null,
//     "birth_date": null,
//     "groups": [],
//     "user_permissions": []
// },
//   "start_time": "2017-07-12T07:17:00Z",
//   "end_time": "2017-07-12T11:17:00Z",
//   "instrument": 5
// }
