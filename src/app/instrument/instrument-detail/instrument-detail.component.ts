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

@Component({
  selector: 'app-instrument-detail',
  templateUrl: './instrument-detail.component.html',
  styleUrls: ['./instrument-detail.component.css']
})
export class InstrumentDetailComponent implements OnInit {
  admin:User;

  currentUser:any;
  username:string;
  userInfo:User;

  instrument: Instrument;
  errorMsg: string;

  scheduleEvents: ScheduleReservation[];
  event: ScheduleReservation;  // event为了跟html中的event交互； selecetedEvent为了记录当前选择了哪个event
  header: any;
  dialogVisible: boolean = false;
  businessHours:any;

  // timepicker
  reservationStartTime:any;
  reservationEndTime:any;

  // schedule
  min_sche: string;
  max_sche: string;
  event_Constraint: any;

  isSaved: boolean;
  isDeleted:boolean;
  isConflicting: boolean;
  errorsStatus:any[];
  daSchedule:boolean = false;


  msgs: Message[] = [];

  constructor(
    private restService: LimsRestService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private authenticationService:AuthenticationService
  ) {
  }
  ngOnInit() {

    this.header = {
      left: 'prev,next today myCustomButton',
      center: 'title',
      right: 'month,agendaWeek,agendaDay listWeek myCustomeButton'
    };
    let storedUser = JSON.parse(localStorage.getItem('currentUser'))
    this.currentUser = storedUser;
    this.username = storedUser? storedUser['user_name']: storedUser;

    if (this.currentUser && this.username){
      this.restService.getUser(this.username).subscribe(
        user=>{
          console.log('我是登录的user:',user);
          this.userInfo=user[0]
        })
    }
    // else {
    //   alert('请重新登录')
    // }

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
          this.getReservation(this.instrument.id);
          console.log(this.instrument.id)
        },
        error => this.errorMsg = error,
        () => {
          this.min_sche = this.instrument.reservation_start_time ? this.instrument.reservation_start_time : '00:00';
          this.max_sche = this.instrument.reservation_end_time ? this.instrument.reservation_end_time : '24:00';
          this.event_Constraint = "businessHours";
          this.businessHours = {
            dow: [0,1,2,3,4,5,6],
            start: this.min_sche,
            end: this.max_sche
          }
        }
      );
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
          allReservations.map(reservation => {
            const event = new ScheduleReservation();
            event.id = reservation.id;
            event.userId = reservation.user;
            allUsers.map((user)=>{
              if (event.userId == user.id){
                event.title = user.last_name+user.first_name;
              }
            });
            event.start = reservation.start_time;
            event.end = reservation.end_time;

            if (this.userInfo && (this.userInfo['id'] == event.userId)){

              if (this.isSameOrBefore(now_time,event.start)){
                this.isDeleted = true;
                event.editable= true;
                event.backgroundColor='#23d271';
              }
              else {
                this.isDeleted = false;
                event.editable = false;
                event.backgroundColor='#939593';
              }
            }
            else {
              if (this.isSameOrBefore(now_time,event.start)){
                this.isDeleted = false;
                event.editable = false;
              }
              else {
                this.isDeleted = false;
                event.editable = false;
                event.backgroundColor='#939593';
              }
            }


            // 只显示过去三个月以来的日程安排；
            const today = moment();
            const lastMonths = today.subtract(3, 'months').format();
            if (moment(event.start).isSameOrAfter(lastMonths)) {
              this.scheduleEvents.push(event);
            }
          })
        }
      )
  }

  handleDayClick(e) {
    // this.dialogVisible = true;
    this.event = new ScheduleReservation();
    this.event.start =e.date?  e.date.format() : e.date.format('YYYY-MM-DD ') + this.instrument.reservation_start_time;
    this.event.end = moment(this.event.start).add(1, 'h').format('YYYY-MM-DDTHH:mm:ss');
    this.event.userId = this.userInfo? this.userInfo.id:null;
    this.event.title = this.userInfo? (this.userInfo.last_name+this.userInfo.first_name):null;

    const now_time = moment().format();
    this.reservationStartTime = e.date.format('YYYY-MM-DD ') + this.instrument.reservation_start_time;
    this.reservationEndTime = e.date.format('YYYY-MM-DD ') + this.instrument.reservation_end_time;

    // 用户名和点击的事件名字相同，才可以保存。
    if (this.currentUser && this.userInfo){
      this.handleConflict(moment(this.event.start), moment(this.event.end), this.event['id'] || null);

      if (this.isSameOrBefore(now_time,this.event.start)){
        this.dialogVisible = true;
        this.event.editable= true;

        this.isSaved = this.isBefore(this.event.start, this.event.end) && this.isSameOrBefore(this.reservationStartTime, this.event.start)
          && this.isSameOrBefore(this.event.end, this.reservationEndTime) && !this.isConflicting;
      }
      else {
        this.dialogVisible = false;
      }
    }
    else {
      this.dialogVisible = false;
    }

    console.log('DayClick的scheduleEvents：', this.scheduleEvents);

    this.errorStatusInfo(now_time)
  }

  //todo: 对已存在的事件，点击进行换时间会造成冲突
  handleEventClick(e) {

    this.event = new ScheduleReservation();
    let start = e.calEvent.start;
    let end = e.calEvent.end;
    this.event.start = start ? start.format() : start.format('YYYY-MM-DD ') + this.instrument.reservation_start_time;
    this.event.end = end ? end.format() : start.add(1, 'h').format();
    this.event.id = e.calEvent.id;
    this.event.title = e.calEvent.title;
    this.event.userId = e.calEvent.userId;

    // 解决 当前时间和当天可预约时间，哪个作为预约的最小时间。
    const now_time = moment().format();
    this.reservationStartTime = start.format('YYYY-MM-DD ') + this.instrument.reservation_start_time;
    this.reservationEndTime = end.format('YYYY-MM-DD ') + this.instrument.reservation_end_time;

    if (this.userInfo && (this.userInfo['id'] == this.event.userId)){
      this.handleConflict(moment(this.event.start), moment(this.event.end), this.event.id);

      if (this.isSameOrBefore(now_time,this.event.start)){
        this.dialogVisible = true;
        this.event.editable= true;

        this.isSaved = this.isBefore(this.event.start, this.event.end) && this.isSameOrBefore(this.reservationStartTime, this.event.start)
          && this.isSameOrBefore(this.event.end, this.reservationEndTime) && !this.isConflicting;
      }
      else {
        this.dialogVisible = false;
      }
    }
    else {
      this.dialogVisible = false;
    }

    console.log('EventClick的scheduleEvents：', this.scheduleEvents)

    this.errorStatusInfo(now_time)
  }

  handleDragResize(e) {
    this.dialogVisible = false;
    this.event = new ScheduleReservation();

    this.event.id = e.event.id ? e.event.id : null;
    this.event.userId = e.event.userId;
    this.event.title = e.event.title;
    let start = e.event.start;
    let end = e.event.end;
    this.event.start = start ? start.format() : null;
    this.event.end = end ? end.format() : start.add(1, 'h').format();

    if (this.userInfo && (this.userInfo['id'] == this.event.userId)){
      const now_time = moment().format();
      if (this.isSameOrBefore(now_time,this.event.start)){
        const reservation={
          start_time : this.event.start,
          end_time : this.event.end,
          id:this.event.id
        };
        this.restService.modifyReservation(this.event.id,reservation).subscribe(data=>console.log('修改的预约为：',data))
      }
      else {
       e.revertFunc()
      }
    }
  }

  saveEvent() {
    this.handleConflict(moment(this.event.start), moment(this.event.end), this.event.id);
    if (this.event.id) {
        let index: number = this.findEventIndexById(this.event.id);
        if (index >= 0) {
          this.event.backgroundColor='#23d271';
          this.scheduleEvents[index] = this.event;

          const reservation={
            start_time : this.event.start,
            end_time : this.event.end
          };
          this.restService.modifyReservation(this.event.id,reservation).subscribe(data=>console.log('修改的预约为：',data))
        }
    }
    //create
    else {
        const reservation = new Reservation();
        reservation.user = this.userInfo.id;
        reservation.start_time = this.event.start;
        reservation.end_time = this.event.end;
        reservation.instrument = this.instrument.id;
        this.restService.createReservation(reservation).subscribe(data=> {
          console.log('创建的新预约是：',data);
          this.event.id = data['reservation']['id'];
          this.event.backgroundColor='#23d271';
          this.scheduleEvents.push(this.event)
        })
    }
    this.isConflicting = false;
    this.dialogVisible = false;
    console.log('save的scheduleEvents：', this.scheduleEvents)
  }

  deleteEvent() {
    let index: number = this.findEventIndexById(this.event.id);
    if (index >= 0) {
      this.scheduleEvents.splice(index, 1);
      this.restService.deleteReservation(this.event.id).subscribe(data=>console.log('删除的预约为：',data))
    }
    this.dialogVisible = false;
  }

  findEventIndexById(id: any) {
    let index = -1;
    for (let i = 0; i < this.scheduleEvents.length; i++) {
      if (id == this.scheduleEvents[i].id) {
        index = i;
        break;
      }
    }
    return index;
  }

  // todo delete the former reservation; // todo 设置删除模式

  setStart(e) {
    // set the start time when pick the time
    this.event.start = moment(e).format('YYYY-MM-DDTHH:mm:ss');

    const now_time = moment().format();

    this.handleConflict(moment(this.event.start), moment(this.event.end), this.event.id);

    this.isSaved = this.isBefore(this.event.start, this.event.end) && this.isSameOrBefore(now_time, this.event.start)
        && this.isSameOrBefore(this.reservationStartTime, this.event.start) && !this.isConflicting;

    this.errorStatusInfo(now_time)
  }

  setEnd(e) {
    // set the end time when pick the time
    this.event.end = moment(e).format('YYYY-MM-DDTHH:mm:ss');

    const now_time = moment().format();

    this.handleConflict(moment(this.event.start), moment(this.event.end), this.event.id);

    this.isSaved = this.isBefore(this.event.start, this.event.end) && this.isSameOrBefore(this.event.end, this.reservationEndTime)
      && !this.isConflicting;

    this.errorStatusInfo(now_time)
  }

  isBefore(one, another):boolean {
    let pass = moment(one).isBefore(moment(another));
    return pass ? pass : false;
  }

  isSameOrBefore(one, another):boolean{
    let pass = moment(one).isSameOrBefore(moment(another));
    return pass ? pass : false;
  }

  // 处理预约时间冲突;
  handleConflict(startT?: moment.Moment, endT?: moment.Moment, id?: any) {
    // todo:可提前几周预约，每次最少预约的时间；如何防止预约次数过多，导致遍历时间复杂度过大。
    for (let i = 0; i < this.scheduleEvents.length; i++) {
      const start = moment(this.scheduleEvents[i].start);
      const end = moment(this.scheduleEvents[i].end);
      const Id = this.scheduleEvents[i].id;
      if (id !== Id) {
        if (startT.isSame(start, 'd') && endT.isSame(end, 'd')) {
          if (startT.isBetween(start, end) ||
            endT.isBetween(start, end) ||
            start.isBetween(startT, endT) ||
            end.isBetween(startT, endT)
          ) {
            this.isConflicting = true;
            break;
          }
          else {
            this.isConflicting = false;
          }
        }
        else {
          this.isConflicting = false;
        }
      }
      else {
        this.isConflicting = false;
      }
    }
  }

  errorStatusInfo(now_time:any):any[]{
    // 这些验证信息必须对应判断this.isSaved的信息。
    return this.errorsStatus = [
      {status:!this.isConflicting,message:'预约时间冲突'},
      {status:this.isBefore(this.event.start, this.event.end),message:'起始时间不得早于结束时间'},
      {status:this.isSameOrBefore(now_time, this.event.start),message:'请在当前时间后预约'},
      {status:this.isSameOrBefore(this.reservationStartTime, this.event.start),message:`起始时间不得早于${this.min_sche}`},
      {status:this.isSameOrBefore(this.event.end, this.reservationEndTime),message:`结束时间不得晚于${this.max_sche}`}
    ]
  }

  toggle():void{
    this.daSchedule = !this.daSchedule;
  }

  // showMultiple(){
  //   this.msgs = [];
  //   this.msgs.push({severity:'info', summary:'Message 1', detail:'PrimeNG rocks'});
  //   this.msgs.push({severity:'info', summary:'Message 2', detail:'PrimeUI rocks'});
  //   this.msgs.push({severity:'info', summary:'Message 3', detail:'PrimeFaces rocks'});
  // }

}

// todo:颜色区分，错误信息提示；
