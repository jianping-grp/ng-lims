import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Instrument} from '../../models/instrument';
import {ActivatedRoute, Params} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {LimsRestService} from '../../service/lims-rest.service';
import {ScheduleReservation} from '../../models/schedule-reservation';
import {Http} from '@angular/http';
import {Reservation} from '../../models/reservation';
import {User} from '../../models/user';
import * as moment from 'moment';


@Component({
  selector: 'app-instrument-detail',
  templateUrl: './instrument-detail.component.html',
  styleUrls: ['./instrument-detail.component.css']
})
export class InstrumentDetailComponent implements OnInit{
  myUser = new User; // simulate a user
  instrument: Instrument;
  errorMsg: string;


  scheduleEvents: ScheduleReservation[];
  event: ScheduleReservation;  // event为了跟html中的event交互； selecetedEvent为了记录当前选择了哪个event
  selectedEvent:ScheduleReservation;

  header:any;
  dialogVisible:boolean=false;

  initReservations:Reservation[];

  min_start:any;
  max:any;
  min_end:any;

  save_pass:boolean;

  constructor(
           private restService: LimsRestService,
           private activatedRoute: ActivatedRoute,
           private http:Http,
           private cd : ChangeDetectorRef
  ) {
    this.myUser.last_name='赵';
    this.myUser.first_name='宇飞';
    this.selectedEvent = new ScheduleReservation();
  }
  ngOnInit() {
    this.header = {
      left: 'prev listWeek next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    };
    this.activatedRoute.params
    // (+) converts string 'id' to a number
      .subscribe((params: Params) => this.getInstrument(+params['id']));
  }
  getInstrument(id: number) {
    this.restService.getInstrument(id)
      .subscribe(
        instrument => {
          console.log('选中的instrument信息：' , instrument)
          this.instrument = instrument;
          this.getReservation(this.instrument.id);
        },
        error => this.errorMsg = error
      );
  }
  getReservation(instrumentId: number) {
    this.scheduleEvents = [];
    this.restService.getReservation(instrumentId)
      .subscribe(
        initReservations => {
          this.initReservations = initReservations;
          console.log('选中的instrument的所有预约情况' , initReservations)
          initReservations.map(reservation => {
            const event = new ScheduleReservation();
            event['id']=reservation.id;
            event['title'] = reservation.user.last_name + reservation.user.first_name;
            event['start'] = reservation.start_time ;
            event['end'] = reservation.end_time ;
            this.scheduleEvents.push(event);
          })
        }
      )
  }
  handleDayClick(e){
    this.dialogVisible = true;
    this.event = new ScheduleReservation();
    console.log('e',e);
    this.event.start = e.date.format();
    this.event.end =  moment(this.event.start).add(2,'h').format('YYYY-MM-DDTHH:mm:ss');
    this.event.title = this.myUser.last_name+this.myUser.first_name;
    // this.cd.detectChanges()
    console.log('DayClick的scheduleEvents：',this.scheduleEvents);

    const now_time = moment().format('YYYY-MM-DD HH:mm:ss');
    const reservationStartTime = e.date.format('YYYY-MM-DD ')+this.instrument.reservation_start_time;
    const now_reservationStart_compare =this.isBefore(now_time,reservationStartTime);
    this.min_start = now_reservationStart_compare ?  reservationStartTime : now_time; // todo:当前时间之后，8点之后才可选
    console.log('this.min_start:',this.min_start)
    this.max = e.date.format('YYYY-MM-DD ')+this.instrument.reservation_end_time;
    console.log('this.max:',this.max)
    this.min_end = e.date.format('YYYY-MM-DD HH:mm:ss');
    console.log('this.min_end:', this.min_end)

    // const now_time = moment().format('YYYY-MM-DD HH:mm:ss');
    this.save_pass = this.isBefore(this.event.start,this.event.end) && this.isBefore(now_time,this.event.end);
  }
  handleEventClick(e){
    this.dialogVisible = true;
    this.event = new ScheduleReservation();
    let start = e.calEvent.start;
    let end = e.calEvent.end;
    this.event.start = start? start.format(): null;
    this.event.end = end? end.format(): start.add(2,'h').format();
    this.event.id = e.calEvent.id;
    this.event.title = e.calEvent.title;
    console.log('EventClick的scheduleEvents：',this.scheduleEvents)

    // 解决 当前时间和当天可预约时间，哪个作为预约的最小时间。
// console.log('比较大小',this.isBefore(moment().format('YYYY-MM-DD HH:mm:ss'),start.format('YYYY-MM-DD ')+this.instrument.reservation_start_time))
    const now_time = moment().format('YYYY-MM-DD HH:mm:ss');
    const reservationStartTime = start.format('YYYY-MM-DD ')+this.instrument.reservation_start_time;
    const now_reservationStart_compare =this.isBefore(now_time,reservationStartTime);
    this.min_start = now_reservationStart_compare ?  reservationStartTime : now_time; // todo:当前时间之后，8点之后才可选
    console.log('this.min_start:',this.min_start)
    this.max = end.format('YYYY-MM-DD ')+this.instrument.reservation_end_time;
    console.log('this.max:',this.max)
    this.min_end = start.format('YYYY-MM-DD HH:mm:ss');
    console.log('this.min_end:', this.min_end)

    this.save_pass = this.isBefore(this.event.start,this.event.end) && this.isBefore(now_time,this.event.end);
  }
  saveEvent(){

    //update
    if (this.event.id){
      let index:number = this.findEventIndexById(this.event.id);
      if (index >= 0){
        console.log('save，this.event:',this.event)
        // this.selectedEvent = this.event;
        this.scheduleEvents[index] = this.event;
      }
    }
    //create
    else {
      // this.event.id = this.idGen++;  // todo id的设置问题，能否用UUID？
      // this.selectedEvent = this.event;
      this.scheduleEvents.push(this.event);
      this.event = null;
    }

    this.dialogVisible=false;
    console.log('save的scheduleEvents：',this.scheduleEvents)
  }
  deleteEvent(){
    let index:number = this.findEventIndexById(this.event.id);
    if (index>=0){
      this.selectedEvent = this.event;
      this.scheduleEvents.splice(index,1)
    }
    this.dialogVisible = false;
    console.log('delete的scheduleEvents：',this.selectedEvent,this.scheduleEvents)
  }
  handleDragResize(e){
    console.log(this.scheduleEvents)
    this.selectedEvent = new ScheduleReservation();
    console.log('e:',e.event.id)
      this.event = new ScheduleReservation();

      this.event.id = e.event.id?e.event.id:null;
      this.event.title = e.event.title;
      let start = e.event.start;
      let end = e.event.end;
      console.log('start:',start, 'end:',end)
      this.event.start = start? start.format(): null;
      this.event.end = end? end.format(): start.add(2,'h').format();
      // this.selectedEvent = event;

      // let index:number = this.findEventIndexById(e.event.id);
      // if (index >= 0){
      //   this.scheduleEvents[index] = this.event;
      // }
      console.log('拖动的scheduleEvents：',this.scheduleEvents)
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

  // todo delete the former reservation; // todo 设置删除模式

  DoWhateverFn(e){
    console.log('dowhateverFn:',e)
  }
  setStart(e){
    // set the start time when pick the time
    this.event.start = moment(e).format('YYYY-MM-DDTHH:mm:ss')
    console.log(moment(e).format('YYYY-MM-DDTHH:mm:ss'))
    this.min_end = moment(e).format('YYYY-MM-DD HH:mm:ss');
    console.log('this.min_end:', this.min_end);

    const now_time = moment().format('YYYY-MM-DD HH:mm:ss');
    this.save_pass = this.isBefore(this.event.start,this.event.end) && this.isBefore(now_time,this.event.end)
  }
  setEnd(e){
    // set the end time when pick the time
    this.event.end = moment(e).format('YYYY-MM-DDTHH:mm:ss')
    console.log(moment(e).format('YYYY-MM-DDTHH:mm:ss'))

    const now_time = moment().format('YYYY-MM-DD HH:mm:ss');
    this.save_pass = this.isBefore(this.event.start,this.event.end) && this.isBefore(now_time,this.event.end);
  }
  isBefore(one,another){
    let pass = moment(one).isBefore(another);
    console.log('pass is',pass)
    return pass ? pass : false;
  }


  // todo 现在实现了scheduleEvents换成新的,下面做向后台发送的。应用Subject
  reserve(){
    if (!this.selectedEvent){
      alert('请选择您要修改的预约或创建新的预约')
    }
    else if (this.selectedEvent && (!this.selectedEvent.end || !this.selectedEvent.start)){
      alert('请检查您预约的开始和结束时间')
    }
    else if (this.selectedEvent && this.selectedEvent.start && this.selectedEvent.end && this.selectedEvent.id){
      if (confirm('确认预约吗？')){
        // todo update the former reservation;
        console.log('selectedEvent:',this.selectedEvent);

        // found the event's id;
        let index = this.findEventIndexById(this.selectedEvent.id);

        if (this.initReservations[index]){
          const reservation=this.initReservations[index];
          let newReservation= new Reservation;
          newReservation.id=reservation.id;
          newReservation.user=reservation.user;
          newReservation.instrument=reservation.instrument;
          newReservation.start_time=this.scheduleEvents[index].start;
          newReservation.end_time=this.scheduleEvents[index].end;
          console.log('newReservation:',newReservation)
          // this.http.put(`http://localhost:8000/api/reservation/${this.selectedEvent.id}`,newReservation)
          //   // .map((res:Response)=>res.json())
          //   .subscribe(data=>console.log(data))
        }
        // todo create the new reservation;
        else {
          let newReservation= new Reservation;
          newReservation.id=this.selectedEvent.id;
          newReservation.start_time=this.selectedEvent.start;
          newReservation.end_time=this.selectedEvent.end;
          newReservation.instrument=this.instrument.id;

          newReservation.user=this.myUser;
          console.log('newReservation:',newReservation)
          // this.http.post(`http://localhost:8000/api/reservation/?instrument=5`,newReservation)
          //   // .map((res:Response)=>res.json())
          //   .subscribe(data=>console.log(data))
        }
      }
    }
  }
}
// todo:预约冲突，颜色区分，错误信息提示,拖动时候时间转换；
