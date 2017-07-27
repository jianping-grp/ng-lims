import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Instrument} from '../../models/instrument';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {LimsRestService} from '../../service/lims-rest.service';
import {ScheduleReservation} from '../../models/schedule-reservation';
import {Http} from '@angular/http';
import {Reservation} from '../../models/reservation';
import {User} from '../../models/user';
import * as moment from 'moment';
import {UUID} from 'angular2-uuid';


@Component({
  selector: 'app-instrument-detail',
  templateUrl: './instrument-detail.component.html',
  styleUrls: ['./instrument-detail.component.css']
})
export class InstrumentDetailComponent implements OnInit {
  myUser = new User; // simulate a user
  instrument: Instrument;
  errorMsg: string;

  scheduleEvents: ScheduleReservation[];
  event: ScheduleReservation;  // event为了跟html中的event交互； selecetedEvent为了记录当前选择了哪个event
  header: any;
  dialogVisible: boolean = false;
  businessHours:any;
  // timepicker
  min_start: any;
  max: any;
  min_end: any;
  reservationStartTime:any;
  reservationEndTime:any;

  //schedule
  min_sche: any;
  max_sche: any;
  event_Constraint: any;

  isSaved: boolean;
  isConflicting: boolean;
  errorStatus:any;

  constructor(
    private restService: LimsRestService,
    private activatedRoute: ActivatedRoute,
    private http: Http,
    private cd: ChangeDetectorRef,
    private router:Router
  ) {
    this.myUser.last_name = '赵';
    this.myUser.first_name = '宇飞';
  }

  ngOnInit() {

    this.header = {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay listWeek myCustomeButton'
    };
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
        instrument => {
          console.log('选中的instrument信息：', instrument)
          this.instrument = instrument;
          this.getReservation(this.instrument.id);
        },
        error => this.errorMsg = error,
        () => {
          this.min_sche = this.instrument.reservation_start_time ? this.instrument.reservation_start_time : '00:00';
          this.max_sche = this.instrument.reservation_end_time ? this.instrument.reservation_end_time : '24:00';
          this.event_Constraint = {
            start: this.min_sche,
            end: this.max_sche
          };
          this.businessHours = {
            dow: [0,1,2,3,4,5,6],
            start: this.instrument.reservation_start_time,
            end: this.instrument.reservation_end_time
          }
        }
      );
  }

  getReservation(instrumentId: number) {
    this.scheduleEvents = [];
    this.restService.getReservation(instrumentId)
      .subscribe(
        initReservations => {
          console.log('选中的instrument的所有预约情况', initReservations)
          initReservations.map(reservation => {
            const event = new ScheduleReservation();
            event['id'] = reservation.id;
            event['title'] = reservation.user.last_name + reservation.user.first_name;
            event['start'] = reservation.start_time;
            event['end'] = reservation.end_time;
            // todo:只显示过去三个月以来的日程安排；
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
    this.dialogVisible = true;
    this.event = new ScheduleReservation();
    this.event.start =e.date?  e.date.format() : e.date.format('YYYY-MM-DD ') + this.instrument.reservation_start_time;
    this.event.end = moment(this.event.start).add(1, 'h').format('YYYY-MM-DDTHH:mm:ss');
    this.event.title = this.myUser.last_name + this.myUser.first_name;

    const now_time = moment().format();
    this.reservationStartTime = e.date.format('YYYY-MM-DD ') + this.instrument.reservation_start_time;
    this.reservationEndTime = e.date.format('YYYY-MM-DD ') + this.instrument.reservation_end_time;

    this.isSaved = this.isBefore(this.event.start, this.event.end) && this.isBefore(now_time, this.event.end)
                && this.isSameOrBefore(this.reservationStartTime, this.event.start) && this.isSameOrBefore(this.event.end, this.reservationEndTime);
    console.log('DayClick的scheduleEvents：', this.scheduleEvents);

    this.errorStatusInfo(now_time)
  }

  //todo: 对已存在的事件，点击进行换时间会造成冲突
  handleEventClick(e) {
    this.dialogVisible = true;
    this.event = new ScheduleReservation();
    let start = e.calEvent.start;
    let end = e.calEvent.end;
    this.event.start = start ? start.format() : start.format('YYYY-MM-DD ') + this.instrument.reservation_start_time;
    this.event.end = end ? end.format() : start.add(2, 'h').format();
    this.event.id = e.calEvent.id;
    this.event.title = e.calEvent.title;

    // 解决 当前时间和当天可预约时间，哪个作为预约的最小时间。
    const now_time = moment().format();
    this.reservationStartTime = start.format('YYYY-MM-DD ') + this.instrument.reservation_start_time;
    this.reservationEndTime = end.format('YYYY-MM-DD ') + this.instrument.reservation_end_time;
    // const now_reservationStart_Compare = this.isBefore(now_time, reservationStartTime);
    // this.min_start = now_reservationStart_Compare ? reservationStartTime : now_time; // todo:当前时间之后，8点之后才可选
    // this.min_end = start.format('YYYY-MM-DD HH:mm:ss');

    this.isSaved = this.isBefore(this.event.start, this.event.end) && this.isBefore(now_time, this.event.end)
                && this.isSameOrBefore(this.reservationStartTime, this.event.start) && this.isSameOrBefore(this.event.end, this.reservationEndTime);
    console.log('EventClick的scheduleEvents：', this.scheduleEvents)

    this.errorStatusInfo(now_time)
  }

  handleDragResize(e) {
    // this.selectedEvent = new ScheduleReservation();
    this.event = new ScheduleReservation();
    this.event.id = e.event.id ? e.event.id : null;
    this.event.title = e.event.title;
    let start = e.event.start;
    let end = e.event.end;
    this.event.start = start ? start.format() : null;
    this.event.end = end ? end.format() : start.add(2, 'h').format();
    console.log(this.event_Constraint);

    const now_time = moment().format();
    this.reservationStartTime = start.format('YYYY-MM-DD ') + this.instrument.reservation_start_time;
    this.reservationEndTime = end.format('YYYY-MM-DD ') + this.instrument.reservation_end_time;

    this.isSaved = this.isBefore(this.event.start, this.event.end) && this.isBefore(now_time, this.event.end)
                && this.isSameOrBefore(this.reservationStartTime, this.event.start) && this.isSameOrBefore(this.event.end, this.reservationEndTime);
    console.log('拖动的scheduleEvents：', this.scheduleEvents)

    this.errorStatusInfo(now_time)
  }

  saveEvent() {
    this.handleConflict(moment(this.event.start), moment(this.event.end), this.event.id);
    if (this.event.id) {
      if (this.isConflicting) {
        alert('时间冲突，请检查');
      }
      else {
        let index: number = this.findEventIndexById(this.event.id);
        if (index >= 0) {
          this.scheduleEvents[index] = this.event;
        }
        // const event = new Reservation();
        // event.start_time = this.event.start;
        // event.end_time = this.event.end;
        // event.instrument = this.instrument.id;
        // this.restService.modifyReservation(this.event.id,event).subscribe(data=> console.log('修改的预约是：',data))
      }
    }
    //create
    else {
      if (this.isConflicting) {
        alert('时间冲突，请检查');
      }
      else {
        this.event.id = UUID.UUID(); //todo:UUid为string;
        // this.selectedEvent = this.event;
        this.scheduleEvents.push(this.event);

        // const event = new Reservation();
        // event.start_time = this.event.start;
        // event.end_time = this.event.end;
        // event.instrument = this.instrument.id;
        // this.restService.createReservation(event).subscribe(data=> console.log('创建的新预约是：',data))

      }
    }
    this.isConflicting = null;
    this.dialogVisible = false;
    console.log('save的scheduleEvents：', this.scheduleEvents)
  }

  deleteEvent() {
    let index: number = this.findEventIndexById(this.event.id);
    if (index >= 0) {
      this.scheduleEvents.splice(index, 1)
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

  DoWhateverFn(e) {
    // this.isSaved = false;
    console.log('dowhateverFn:', e)
  }

  setStart(e) {
    // set the start time when pick the time
    this.event.start = moment(e).format('YYYY-MM-DDTHH:mm:ss');

    const now_time = moment().format();
    this.isSaved = this.isBefore(this.event.start, this.event.end) && this.isBefore(now_time, this.event.end)
                && this.isSameOrBefore(this.reservationStartTime, this.event.start) && this.isSameOrBefore(this.event.end, this.reservationEndTime);

    this.errorStatusInfo(now_time)
  }

  setEnd(e) {
    // set the end time when pick the time
    this.event.end = moment(e).format('YYYY-MM-DDTHH:mm:ss');

    const now_time = moment().format();
    this.isSaved = this.isBefore(this.event.start, this.event.end) && this.isBefore(now_time, this.event.end)
                && this.isSameOrBefore(this.reservationStartTime, this.event.start) && this.isSameOrBefore(this.event.end, this.reservationEndTime);

    this.errorStatusInfo(now_time)
  }

  isBefore(one, another):boolean {
    let pass = moment(one).isBefore(moment(another));
    console.log('pass is', pass);
    return pass ? pass : false;
  }

  isSameOrBefore(one, another):boolean{
    let pass = moment(one).isSameOrBefore(moment(another));
    console.log('samepass is', pass);
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
          }
        }
        else {
        }
      }
      else {
      }
    }
    console.log(this.isConflicting)
  }

  errorStatusInfo(now_time:any){
    // 这四条验证信息必须对应判断this.isSaved这四条。
    return this.errorStatus = {
      first:{status:this.isBefore(this.event.start, this.event.end),message:'起始时间必须小于结束时间'},
      second:{status:this.isBefore(now_time, this.event.end),message:'结束时间必须在当前时间之后'},
      third:{status:this.isSameOrBefore(this.reservationStartTime, this.event.start),message:`起始时间不得早于${this.instrument.reservation_start_time}`},
      four:{status:this.isSameOrBefore(this.event.end, this.reservationEndTime),message:`结束时间不得晚于${this.instrument.reservation_end_time}`}
    }
  }

  // ErrorMessages = {
  //   first:'起始时间必须小于结束时间',
  //   second:'结束时间必须在当前时间之后',
  //   third:`起始时间不得早于${this.instrument.reservation_start_time}`,
  //   four:`结束时间不得晚于${this.instrument.reservation_end_time}`
  // }
}

// todo:颜色区分，错误信息提示；
