import {Component, Input} from '@angular/core';
import {ScheduleReservation} from "../../../models/schedule-reservation";
import {User} from "../../../models/user";
import {Message} from "primeng/primeng";
import * as moment from "moment";
import {Instrument} from "../../../models/instrument";
import {LimsRestService} from "../../../service/lims-rest.service";
import {Reservation} from "../../../models/reservation";

@Component({
  selector: 'reservation-schedule',
  templateUrl: './reservation-schedule.component.html',
  styleUrls: ['./reservation-schedule.component.css']
})
export class ReservationScheduleComponent{
  @Input() instrument:Instrument;

  @Input() scheduleEvents:ScheduleReservation[];
  @Input() businessHours:any;
  @Input() event_Constraint: any;
  header: any;
  dialogVisible: boolean = false;
  event: ScheduleReservation;

  @Input() currentUser:any;
  @Input() userInfo:User;

  // timepicker
  reservationStartTime:any;
  reservationEndTime:any;

  // schedule
  @Input() min_sche: string;
  @Input() max_sche: string;

  isSaved: boolean;
  isConflicting: boolean;
  errorsStatus:any[];

  msgs: Message[] = [];
  growlStyle:any;

  constructor(
    private restService:LimsRestService
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
  isBefore(one, another):boolean {
    let pass = moment(one).isBefore(moment(another));
    return pass ? pass : false;
  }

  isSameOrBefore(one, another):boolean{
    let pass = moment(one).isSameOrBefore(moment(another));
    return pass ? pass : false;
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
    this.showErrorInfo()
  }

  handleEventClick(e) {

    this.event = new ScheduleReservation();
    let start = e.calEvent.start;
    let end = e.calEvent.end;
    this.event.start = start ? start.format() : start.format('YYYY-MM-DD ') + this.instrument.reservation_start_time;
    this.event.end = end ? end.format() : start.add(1, 'h').format();
    this.event.id = e.calEvent.id;
    this.event.title = e.calEvent.title;
    this.event.userId = e.calEvent.userId;

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
  }

  handleDrag(e) {
    this.dialogVisible = false;

    const now_time = moment().format();
    if (this.isSameOrBefore(now_time,e.event.start.format())){
      const reservation={
        start_time : e.event.start.format(),
        end_time : e.event.end.format(),
        id:e.event.id
      };
      this.restService.modifyReservation(e.event.id,reservation).subscribe(data=>console.log('修改的预约为：',data))
    }
    else {
      e.revertFunc();
      this.event = new ScheduleReservation();
      this.event.id = e.event.id ? e.event.id : null;
      this.event.userId = e.event.userId;
      this.event.title = e.event.title;
      let start = e.event.start;
      let end = e.event.end;
      this.event.start = start ? start.format() : null;
      this.event.end = end ? end.format() : start.add(1, 'h').format();
      this.event.editable = true;

      let index: number = this.findEventIndexById(this.event.id);
      if (index >= 0) {
        this.event.backgroundColor='#23d271';
        this.scheduleEvents[index] = this.event;
      }
    }
    console.log(this.event)
  }

  handleResize(e){
    this.dialogVisible = false;

    const now_time = moment().format();
    if (this.isSameOrBefore(now_time,e.event.end.format())){
      const reservation={
        start_time : e.event.start.format(),
        end_time : e.event.end.format(),
        id:e.event.id
      };
      this.restService.modifyReservation(e.event.id,reservation).subscribe(data=>console.log('修改的预约为：',data))
    }
    else {
      e.revertFunc();
      this.event = new ScheduleReservation();
      this.event.id = e.event.id ? e.event.id : null;
      this.event.userId = e.event.userId;
      this.event.title = e.event.title;
      let start = e.event.start;
      let end = e.event.end;
      this.event.start = start ? start.format() : null;
      this.event.end = end ? end.format() : start.add(1, 'h').format();
      this.event.editable = true;
      this.event.startEditable=false;

      let index: number = this.findEventIndexById(this.event.id);
      if (index >= 0) {
        this.event.backgroundColor='#db8272';
        this.scheduleEvents[index] = this.event;
      }
    }
    console.log(this.event)
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
      && this.isSameOrBefore(this.reservationStartTime, this.event.start) && this.isSameOrBefore(this.event.end, this.reservationEndTime)
      && !this.isConflicting;

    // this.errorStatusInfo(now_time)
    this.showErrorInfo()
  }

  setEnd(e) {
    // set the end time when pick the time
    this.event.end = moment(e).format('YYYY-MM-DDTHH:mm:ss');

    const now_time = moment().format();

    this.handleConflict(moment(this.event.start), moment(this.event.end), this.event.id);

    this.isSaved = this.isBefore(this.event.start, this.event.end) && this.isSameOrBefore(now_time, this.event.start)
      && this.isSameOrBefore(this.reservationStartTime, this.event.start) && this.isSameOrBefore(this.event.end, this.reservationEndTime)
      && !this.isConflicting;

    // this.errorStatusInfo(now_time)
    this.showErrorInfo()
  }

  // 处理预约时间冲突;
  handleConflict(startT?: moment.Moment, endT?: moment.Moment, id?: any) {
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
      {status:!this.isConflicting,message:{severity:'error', summary:'温馨提示', detail:'预约时间冲突'}},
      {status:this.isSameOrBefore(now_time,this.event.start),message:{severity:'error', summary:'温馨提示', detail:'预约开始时间应在当前时间之后'}},
      {status:this.isBefore(this.event.start, this.event.end),message:{severity:'error', summary:'温馨提示', detail:'起始时间应早于结束时间'}},
      {status:this.isSameOrBefore(this.reservationStartTime, this.event.start),message:{severity:'error', summary:'温馨提示', detail:`起始时间应晚于${this.min_sche}`}},
      {status:this.isSameOrBefore(this.event.end, this.reservationEndTime),message:{severity:'error', summary:'温馨提示', detail:`结束时间应早于${this.max_sche}`}}
    ]
  }

  showErrorInfo(){
    const now_time = moment().format();
    this.msgs = [];
    if (this.currentUser){
      this.errorStatusInfo(now_time).map((error)=>{
        if (!error.status){
          this.msgs.push(error.message)
        }
      })
    }
    else {
      this.msgs.push({severity:'error', summary:'温馨提示', detail:'请登录后预约'})
    }
  }

}
