import {Component, OnInit} from '@angular/core';
import {Instrument} from "../../models/instrument";
import {LimsRestService} from "../../service/lims-rest.service";
import {ActivatedRoute, Params} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import {User} from "../../models/user";
import {Meta} from "../../models/meta";

@Component({
  selector: 'app-instrument-list',
  templateUrl: './instrument-list.component.html',
  styleUrls: ['./instrument-list.component.css']
})
export class InstrumentListComponent implements OnInit {
  instrumentList: Instrument[];
  admins:User[];
  errorMsg: string;

  meta:Meta;
  _total:number;
  _current:number=1;
  _pageSize:number=9;

  departmentId:number;

  constructor(private restService: LimsRestService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    console.log('instrument list init...')
    this.activatedRoute.params
      .subscribe(
        (params: Params) => {
          this.departmentId = +params['department'];
          this.getInstrumentListByDepartment(this.departmentId);
        }
      )
  }

  getInstrumentListByDepartment(departmentId: number,e?:number) {
    console.log(`get instrument list (department id ${departmentId})`)
    // all instruments
      e = e ? e : 1;
      if (isNaN(departmentId)) {
        departmentId = 0;
      }
      this.restService.getInstrumentListByDepartment(departmentId,e,this._pageSize)
        .subscribe(
          data => {
            this.admins = data['users'];
            this.instrumentList = data['instruments'];
            this.meta = data['meta'];
          },
          error => this.errorMsg = <any> error
        )
  }

}
