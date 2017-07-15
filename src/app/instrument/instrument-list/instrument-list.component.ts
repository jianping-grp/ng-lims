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

@Component({
  selector: 'app-instrument-list',
  templateUrl: './instrument-list.component.html',
  styleUrls: ['./instrument-list.component.css']
})
export class InstrumentListComponent implements OnInit {
  instrumentList: Instrument[];
  departmentId: number;
  errorMsg: string;

  constructor(private restService: LimsRestService,
              private route: ActivatedRoute) {
    console.log('instrument list constructed')
    // this.shareService.selectedDepartmentID$.subscribe(
    //   data => {
    //     this.getInstrumentListByDepartment(data);
    //   }
    // )
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
    if (isNaN(departmentId)){
      departmentId = 0;
    }

    if (departmentId === 0) {
      this.restService.getInstrumentList()
        .subscribe(
          instrumentList => this.instrumentList = instrumentList,
          error => this.errorMsg = <any> error
        )
    }
    else {
      this.restService.getInstrumentListByDepartment(departmentId)
        .subscribe(
          instrumentList => this.instrumentList = instrumentList,
          error => this.errorMsg = <any> error
        )
    }
  }
}
