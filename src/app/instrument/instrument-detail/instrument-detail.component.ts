import {AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
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

  // timepicker
  min_start:any;
  max:any;
  min_end:any;

  //schedule
  min_sche:any;
  max_sche:any;
  event_Constraint:any;

  isSaved:boolean;
  isConflicting:boolean;

  constructor(
           private restService: LimsRestService,
           private activatedRoute: ActivatedRoute,
           private http:Http,
           private cd : ChangeDetectorRef
  ) {
    this.myUser.last_name='赵';
    this.myUser.first_name='宇飞';
    this.selectedEvent = new ScheduleReservation();
    console.log('moment()为null:',moment(null).isSame('2017-10-10','day'))

  }

  ngOnInit() {
    this.header = {
      left: 'prev listWeek next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    };
    this.activatedRoute.params
    // (+) converts string 'id' to a number
      .subscribe(
        (params: Params) => this.getInstrument(+params['id']),
        (err:Error)=>console.log(err)
      );
  }
  getInstrument(id: number) {
    this.restService.getInstrument(id)
      .subscribe(
        instrument => {
          console.log('选中的instrument信息：' , instrument)
          this.instrument = instrument;
          this.getReservation(this.instrument.id);
        },
        error => this.errorMsg = error,
        ()=>{
          this.min_sche = this.instrument.reservation_start_time? this.instrument.reservation_start_time : '00:00';
          this.max_sche = this.instrument.reservation_end_time ? this.instrument.reservation_end_time : '23:59';
          this.event_Constraint = {
            start: this.min_sche,
            end: this.max_sche
          }
        }
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
    const now_reservationStart_Compare =this.isBefore(now_time,reservationStartTime);
    this.min_start = now_reservationStart_Compare ?  reservationStartTime : now_time; // todo:当前时间之后，8点之后才可选
    console.log('this.min_start:',this.min_start)
    this.max = e.date.format('YYYY-MM-DD ')+this.instrument.reservation_end_time;
    // console.log('this.max:',this.max)
    this.min_end = e.date.format('YYYY-MM-DD HH:mm:ss');
    // console.log('this.min_end:', this.min_end)
    // this.min_start = this.now_reservation_Compare(e.date).min_start;


    // const now_time = moment().format('YYYY-MM-DD HH:mm:ss');
    this.isSaved = this.isBefore(this.event.start,this.event.end) && this.isBefore(now_time,this.event.end);
  }
  //todo: 对已存在的事件，点击进行换时间会造成冲突
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
    const now_time = moment().format('YYYY-MM-DD HH:mm:ss');
    const reservationStartTime = start.format('YYYY-MM-DD ')+this.instrument.reservation_start_time;
    const now_reservationStart_Compare =this.isBefore(now_time,reservationStartTime);
    this.min_start = now_reservationStart_Compare ?  reservationStartTime : now_time; // todo:当前时间之后，8点之后才可选
    console.log('this.min_start:',this.min_start)
    this.max = end.format('YYYY-MM-DD ')+this.instrument.reservation_end_time;
    // console.log('this.max:',this.max)
    this.min_end = start.format('YYYY-MM-DD HH:mm:ss');
    // console.log('this.min_end:', this.min_end)

    // this.min_end = this.now_reservation_Compare(e.date).min_end;

    this.isSaved = this.isBefore(this.event.start,this.event.end) && this.isBefore(now_time,this.event.end);
  }
  saveEvent(){
    this.isConflicting = this.isBetween(moment(this.event.start),moment(this.event.end));

    if (this.isConflicting){
      alert('时间冲突，请检查')
    }
    else if (!this.isConflicting){
      //update
      if (this.event.id){
        let index:number = this.findEventIndexById(this.event.id);
        if (index >= 0){
          // this.selectedEvent = this.event;
          this.scheduleEvents[index] = this.event;
        }
      }
      //create
      else {
        // this.event.id = this.idGen++;
        // this.selectedEvent = this.event;
        this.scheduleEvents.push(this.event);

      }
    }
    this.dialogVisible=false;
    console.log('save的scheduleEvents：',this.scheduleEvents)
    console.log(this.event)
    console.log('save  isConflicting:',this.isConflicting)

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
    // this.selectedEvent = new ScheduleReservation();
    this.event = new ScheduleReservation();
    this.event.id = e.event.id?e.event.id:null;
    this.event.title = e.event.title;
    let start = e.event.start;
    let end = e.event.end;
    this.event.start = start? start.format(): null;
    this.event.end = end? end.format(): start.add(2,'h').format();
    console.log(this.event_Constraint)

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

    // 是否禁用save
    const now_time = moment().format('YYYY-MM-DD HH:mm:ss');
    this.isSaved = this.isBefore(this.event.start,this.event.end) && this.isBefore(now_time,this.event.end)

    // 是否预约时间冲突
  }
  setEnd(e){
    // set the end time when pick the time
    this.event.end = moment(e).format('YYYY-MM-DDTHH:mm:ss')
    console.log(moment(e).format('YYYY-MM-DDTHH:mm:ss'))

    const now_time = moment().format('YYYY-MM-DD HH:mm:ss');
    this.isSaved = this.isBefore(this.event.start,this.event.end) && this.isBefore(now_time,this.event.end);

  }
  isBefore(one,another){
    let pass = moment(one).isBefore(another);
    console.log('pass is',pass)
    return pass ? pass : false;
  }
  // 当前时间和选择日预约时间的比较方法;
  now_reservation_Compare(time_Compared:moment.Moment){
    const now_time = moment().format('YYYY-MM-DD HH:mm:ss');
    const reservationStartTime = time_Compared.format('YYYY-MM-DD ')+this.instrument.reservation_start_time;
    const now_reservationStart_Compare =this.isBefore(now_time,reservationStartTime);
    const min_start = now_reservationStart_Compare ?  reservationStartTime : now_time; // todo:当前时间之后，8点之后才可选
    console.log('this.min_start:',min_start);
    return {
      min_start: min_start
    }
  }
  // 处理预约时间冲突;
  isBetween(startT?:moment.Moment,endT?:moment.Moment){
    // todo:可提前几周预约，每次最少预约的时间；如何防止预约次数过多，导致遍历时间复杂度过大。
    if (this.scheduleEvents.length <= 100){
      for (let i = 0; i<this.scheduleEvents.length;i++){
        const start=moment(this.scheduleEvents[i].start);
        const end=moment(this.scheduleEvents[i].end);
        if (startT.isSame(start,'d') && endT.isSame(end,'d')){
          if (startT.isSame(start) || endT.isSame(end) ){
            console.log('检查冲突中循环到了自己');
          }
          else if(startT.isBetween(start,end) || endT.isBetween(start,end) || start.isBetween(startT,endT) || end.isBetween(startT,endT)){
            return true;
          }
          else  {
            console.log('内层判断 不冲突');
            return false;
          }
        }
        else {
          console.log('外层判断 不冲突');
        }
      }
    }
    // else {
    //   for (let i = this.scheduleEvents.length-100; i<this.scheduleEvents.length;i++){
    //     const start=this.scheduleEvents[i].start;
    //     const end=this.scheduleEvents[i].end;
    //     if (moment(startT).isSame(start,'d') || moment(endT).isSame(end,'d')){
    //       if (moment(startT).isBetween(start,end) || moment(endT).isBetween(start,end) ){
    //         alert('预约时间冲突');
    //         return true;
    //       }
    //       else  {
    //         console.log('内错误')
    //         return false;
    //       }
    //     }
    //     else {
    //       console.log('外层错误')
    //     }
    //   }
    // }
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
// todo:颜色区分，错误信息提示；
