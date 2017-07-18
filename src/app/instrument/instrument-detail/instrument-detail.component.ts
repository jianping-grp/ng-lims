import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Instrument} from '../../models/instrument';
import {ActivatedRoute, Params} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {LimsRestService} from '../../service/lims-rest.service';
import {ScheduleReservation} from '../../models/schedule-reservation';
import set = Reflect.set;
import {Http} from '@angular/http';
import {Reservation} from '../../models/reservation';
import {User} from '../../models/user';

@Component({
  selector: 'app-instrument-detail',
  templateUrl: './instrument-detail.component.html',
  styleUrls: ['./instrument-detail.component.css']
})
export class InstrumentDetailComponent implements OnInit{
  myUser = new User; // simulate a user
  instrument: Instrument;
  errorMsg: string;
  instrumentId:number;

  scheduleEvents: any[];
  event: ScheduleReservation;  // event为了跟html中的event交互； selecetedEvent为了记录当前选择了哪个event
  selectedEvent:ScheduleReservation;

  header:any;
  dialogVisible:boolean=false;
  idGen:number=100;

  allReservations:Reservation[];

  constructor(
           private restService: LimsRestService,
           private activatedRoute: ActivatedRoute,
           private http:Http,
           private cd : ChangeDetectorRef
  ) {
    this.myUser.last_name='赵';
    this.myUser.first_name='宇飞';

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
          this.allReservations = allReservations;
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


  // start.stripTime().format()可以将日期转化成yyyy-mm-dd;
  handleEventClick(e){
    this.dialogVisible = true;
    this.event = new ScheduleReservation;
    this.event.title = e.calEvent.title;
    let start = e.calEvent.start;
    let end = e.calEvent.end;

    if (e.view.name === 'agendaWeek'){
      start.stripTime()
    }
    if (end){
      end.stripTime();
      this.event.end = end.format();
    }
    this.event.start = start.format(); // start.stripTime().format()可以将日期转化成yyyy-mm-dd；
    this.event.id = e.calEvent.id;
    // console.log('EventClick时，得到事件的开始时间格式，start.format():',start.format());
    console.log('EventClick的scheduleEvents：',this.scheduleEvents)
  }
  handleDayClick(e){
    this.dialogVisible = true;
    this.event = new ScheduleReservation;
    // console.log('DayClick时，得到事件的开始时间格式，e.date|e.date.format()|e.date.stripTime():', e.date,'|',e.date.format(),'|',e.date.stripTime());
    this.event.start = e.date.stripTime().format();
    this.event.title = this.myUser.last_name+this.myUser.first_name;
    this.cd.detectChanges()
    console.log('DayClick的scheduleEvents：',this.scheduleEvents)
  }
  saveEvent(){
    //update
    if (this.event.id){
      let index:number = this.findEventIndexById(this.event.id);
      if (index >= 0){
        this.selectedEvent = this.event;
        this.scheduleEvents[index] = this.event;
      }
    }
    //create
    else {
      this.event.id = this.idGen++;  // todo id的设置问题，能否用UUID？
      this.selectedEvent = this.event;
      this.scheduleEvents.push(this.event);
      this.event = null;
    }

    this.dialogVisible=false;
    console.log('save的scheduleEvents：',this.scheduleEvents)
  }
  deleteEvent(){
    let index:number = this.findEventIndexById(this.event.id);
    if (index>=0){
      this.scheduleEvents.splice(index,1)
    }
    this.dialogVisible = false;
    console.log('delete的scheduleEvents：',this.scheduleEvents)
  }
  handleDragResize(e){
      let event = new ScheduleReservation;
      this.selectedEvent = new ScheduleReservation;
      event.id = e.event.id;
      event.title = e.event.title;
      event.start = e.event.start? e.event.start.format() : null;
      event.end = e.event.end? e.event.end.format() : null;
      this.selectedEvent = event;

      let index:number = this.findEventIndexById(e.event.id);
      if (index >= 0){
        this.scheduleEvents[index] = event;
      }
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
// todo 现在实现了scheduleEvents换成新的,下面做向后台发送的。
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
        if (this.allReservations[index]){
          const reservation=this.allReservations[index];
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
          newReservation.instrument=this.allReservations[0].instrument;

          newReservation.user=this.myUser;
          console.log('newReservation:',newReservation)
          // this.http.post(`http://localhost:8000/api/reservation/?instrument=5`,newReservation)
          //   // .map((res:Response)=>res.json())
          //   .subscribe(data=>console.log(data))
        }
      }
    }
  }
  // todo delete the former reservation;
  deleteReservation(){

  }

}
