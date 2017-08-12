import {Component, Input, OnInit} from '@angular/core';
import {Instrument} from "../../models/instrument";
import {LimsRestService} from "../../service/lims-rest.service";
import {ShareService} from "../../service/share.service";
import {ActivatedRoute, ActivatedRouteSnapshot, ParamMap, Params} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import {Observable} from "rxjs/Observable";
import {Department} from "../../models/department";
import {isUndefined} from "util";
import {User} from "../../models/user";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'app-instrument-list',
  templateUrl: './instrument-list.component.html',
  styleUrls: ['./instrument-list.component.css']
})
export class InstrumentListComponent implements OnInit {
  instrumentList: Instrument[];
  admins:User[];
  instruments_admins:any;
  errorMsg: string;

  constructor(private restService: LimsRestService,
              private route: ActivatedRoute) {
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
              data => {
                // localStorage.setItem('instruments_admins',JSON.stringify(data));
                // this.instruments_admins.next(data)
                this.instruments_admins = data;
                this.admins = data['users'];
                this.instrumentList = data['instruments'];
              },
              error => this.errorMsg = <any> error
            )
        // else {
        //   this.admins = this.instruments_admins['users'];
        //   this.instrumentList = this.instruments_admins['instruments'];
        // }
      }
      else {
        this.restService.getInstrumentListByDepartment(departmentId)
          .subscribe(
            data => {
              this.instruments_admins = data;
              this.admins = data['users'];
              this.instrumentList = data['instruments'];
            },
            error => this.errorMsg = <any> error
          )
      }

  }

}
