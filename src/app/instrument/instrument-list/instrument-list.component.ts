import {Component, Input, OnInit} from '@angular/core';
import {Instrument} from "../../models/instrument";
import {LimsRestService} from "../../service/lims-rest.service";
import {ShareService} from "../../service/share.service";
import {ActivatedRoute, ActivatedRouteSnapshot, ParamMap, Params} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import gql from 'graphql-tag';
import {GqlService} from "../../service/gql.service";
import {Observable} from "rxjs/Observable";
import {Department} from "../../models/department";
import {isUndefined} from "util";


export class MyEvent {
  id: number;
  title: string;
  start: string;
  end: string;
}
@Component({
  selector: 'app-instrument-list',
  templateUrl: './instrument-list.component.html',
  styleUrls: ['./instrument-list.component.css']
})
export class InstrumentListComponent implements OnInit {
  instrumentList: Instrument[];
  errorMsg: string;


  constructor(private restService: LimsRestService,
              private route: ActivatedRoute) {
    console.log('instrument list constructed')

  }

  ngOnInit() {
    console.log('instrument list init...')
    this.route.params
      .subscribe(
        (params: Params) => {
          this.getInstrumentListByDepartment(+params['department'])
        }
      )
  }

  getInstrumentListByDepartment(departmentId: number) {
    console.log(`get instrument list (department id ${departmentId})`)
    // all instruments

      if (isNaN(departmentId)) {
        departmentId = 0;
      }

      if (departmentId === 0) {
        this.restService.getInstrumentList()
          .subscribe(
            instrumentList => {
              this.instrumentList = instrumentList;
            },
            error => this.errorMsg = <any> error
          )
      }
      else {
        this.restService.getInstrumentListByDepartment(departmentId)
          .subscribe(
            instrumentList => {
              this.instrumentList = instrumentList;
            },
            error => this.errorMsg = <any> error
          )
      }

  }








  // handleDayClick(event) {
  //   this.event = new MyEvent();
  //   this.event.start = event.date.format();
  //   this.dialogVisible = true;
  // }
  //
  // handleEventClick(e) {
  //   this.event = new MyEvent();
  //   this.event.title = e.calEvent.title;
  //
  //   let start = e.calEvent.start;
  //   let end = e.calEvent.end;
  //   if(e.view.name === 'month') {
  //     start.stripTime();
  //   }
  //
  //   if(end) {
  //     end.stripTime();
  //     this.event.end = end.format();
  //   }
  //
  //   this.event.id = e.calEvent.id;
  //   this.event.start = start.format();
  //   this.dialogVisible = true;
  // }
  //
  // saveEvent() {
  //   //update
  //   if(this.event.id) {
  //     let index: number = this.findEventIndexById(this.event.id);
  //     if(index >= 0) {
  //       this.events[index] = this.event;
  //     }
  //   }
  //   //new
  //   else {
  //     this.event.id = this.idGen++;
  //     this.events.push(this.event);
  //     this.event = null;
  //   }
  //
  //   this.dialogVisible = false;
  // }
  //
  // deleteEvent() {
  //   let index: number = this.findEventIndexById(this.event.id);
  //   if(index >= 0) {
  //     this.events.splice(index, 1);
  //   }
  //   this.dialogVisible = false;
  // }
  //
  // findEventIndexById(id: number) {
  //   let index = -1;
  //   for(let i = 0; i < this.events.length; i++) {
  //     if(id == this.events[i].id) {
  //       index = i;
  //       break;
  //     }
  //   }
  //
  //   return index;
  // }

}
